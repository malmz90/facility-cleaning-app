import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppText from "@/components/ui/AppText";
import StatCard from "@/components/ui/StatCard";
import TaskList from "@/components/ui/TaskList";
import { COLORS } from "@/constants";
import {
  annotateRoomsWithStatus,
  buildLastCleanedMap,
  formatRelativeTime,
  getRoomStatusCounts,
  sortRoomsByStatus,
} from "@/lib/room-status";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_organization_id")
    .eq("id", user.id)
    .single();

  const orgId = profile?.active_organization_id;

  let buildings = [];
  if (orgId) {
    const { data: buildingData } = await supabase
      .from("buildings")
      .select("id, name, address, created_at")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    buildings = buildingData ?? [];
  }

  const buildingIds = buildings.map((building) => building.id);
  let rooms = [];
  if (buildingIds.length > 0) {
    const { data: roomData } = await supabase
      .from("rooms")
      .select("id, name, building_id, cleaning_frequency")
      .in("building_id", buildingIds);
    rooms = roomData ?? [];
  }

  const roomIds = rooms.map((room) => room.id);
  let cleaningLogs = [];
  if (roomIds.length > 0) {
    const { data: cleaningLogData } = await supabase
      .from("cleaning_logs")
      .select("room_id, cleaned_at")
      .in("room_id", roomIds);
    cleaningLogs = cleaningLogData ?? [];
  }

  const lastCleanedByRoom = buildLastCleanedMap(cleaningLogs);
  const roomsWithStatus = sortRoomsByStatus(annotateRoomsWithStatus(rooms, lastCleanedByRoom));
  const roomCounts = getRoomStatusCounts(roomsWithStatus);

  const buildingMap = new Map(buildings.map((building) => [building.id, building]));
  const roomsByBuilding = new Map();
  for (const room of roomsWithStatus) {
    const current = roomsByBuilding.get(room.building_id) ?? [];
    current.push(room);
    roomsByBuilding.set(room.building_id, current);
  }

  const buildingSummaries = buildings
    .map((building) => {
      const buildingRooms = roomsByBuilding.get(building.id) ?? [];
      return {
        ...building,
        counts: getRoomStatusCounts(buildingRooms),
      };
    })
    .sort((a, b) => {
      if (a.counts.overdue !== b.counts.overdue) {
        return b.counts.overdue - a.counts.overdue;
      }
      if (a.counts.due !== b.counts.due) {
        return b.counts.due - a.counts.due;
      }
      return a.name.localeCompare(b.name, "sv");
    });

  const urgentRoomTasks = roomsWithStatus
    .filter((room) => room.status !== "clean")
    .slice(0, 8)
    .map((room) => {
      const building = buildingMap.get(room.building_id);
      const isOverdue = room.status === "overdue";
      return {
        id: room.id,
        title: room.name,
        location: `${building?.name ?? "Okänd byggnad"} • ${formatRelativeTime(room.last_cleaned)}`,
        status: isOverdue ? "🔴 Försenad" : "🟡 Snart dags",
        statusColor: isOverdue ? COLORS.error : COLORS.warning,
        statusBg: isOverdue ? "#fff1f1" : "#fff6ef",
      };
    });

  const stats = [
    { label: "🔵 Byggnader", value: buildings.length.toString(), color: COLORS.info },
    { label: "🟢 Rena rum", value: roomCounts.clean.toString(), color: COLORS.success },
    { label: "🟡 Snart dags", value: roomCounts.due.toString(), color: COLORS.warning },
    { label: "🔴 Försenade rum", value: roomCounts.overdue.toString(), color: COLORS.error },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.headingRow}>
          <AppText as="h1" variant="pageTitle">
            Översikt
          </AppText>
        </div>
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          Här ser du städstatus för byggnader och rum i din organisation.
        </AppText>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <AppText as="h2" variant="cardHeading">
            Byggnader
          </AppText>
        </div>
        <div className={styles.buildingList}>
          {buildingSummaries.length === 0 ? (
            <AppText as="p" size="small" color={COLORS.textSecondary}>
              Inga byggnader ännu.
            </AppText>
          ) : (
            buildingSummaries.map((building) => (
              <Link
                key={building.id}
                href={`/dashboard/buildings/${building.id}`}
                className={styles.buildingRow}
              >
                <div className={styles.buildingInfo}>
                  <AppText as="p" size="body" weight="semiBold">
                    {building.name}
                  </AppText>
                  {building.address ? (
                    <AppText as="p" size="small" color={COLORS.textSecondary}>
                      {building.address}
                    </AppText>
                  ) : null}
                </div>
                <div className={styles.statusCounts}>
                  <AppText as="span" size="small" color={COLORS.success}>
                    🟢 {building.counts.clean}
                  </AppText>
                  <AppText as="span" size="small" color={COLORS.warning}>
                    🟡 {building.counts.due}
                  </AppText>
                  <AppText as="span" size="small" color={COLORS.error}>
                    🔴 {building.counts.overdue}
                  </AppText>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <TaskList heading="Rum som behöver städning" tasks={urgentRoomTasks} />
    </div>
  );
}
