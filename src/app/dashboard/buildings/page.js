import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AppText from "@/components/ui/AppText";
import AddBuildingModal from "@/components/ui/AddBuildingModal";
import { COLORS } from "@/constants";
import {
  annotateRoomsWithStatus,
  buildLastCleanedMap,
} from "@/lib/room-status";
import styles from "./page.module.css";

export default async function BuildingsPage() {
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

  const { data: buildings } = await supabase
    .from("buildings")
    .select("id, name, address, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const buildingIds = buildings?.map((building) => building.id) ?? [];

  let rooms = [];
  if (buildingIds.length > 0) {
    const { data: roomData } = await supabase
      .from("rooms")
      .select("id, building_id, cleaning_frequency")
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
  const roomsWithStatus = annotateRoomsWithStatus(rooms, lastCleanedByRoom);

  const roomStatsByBuilding = new Map();
  for (const buildingId of buildingIds) {
    roomStatsByBuilding.set(buildingId, { clean: 0, due: 0, overdue: 0, total: 0 });
  }

  for (const room of roomsWithStatus) {
    const buildingStats = roomStatsByBuilding.get(room.building_id) ?? {
      clean: 0,
      due: 0,
      overdue: 0,
      total: 0,
    };
    const statusKey = room.status === "due" || room.status === "overdue" ? room.status : "clean";
    roomStatsByBuilding.set(room.building_id, {
      clean: buildingStats.clean + (statusKey === "clean" ? 1 : 0),
      due: buildingStats.due + (statusKey === "due" ? 1 : 0),
      overdue: buildingStats.overdue + (statusKey === "overdue" ? 1 : 0),
      total: buildingStats.total + 1,
    });
  }

  const buildingsWithStats = (buildings ?? []).map((building) => ({
    ...building,
    stats: roomStatsByBuilding.get(building.id) ?? {
      clean: 0,
      due: 0,
      overdue: 0,
      total: 0,
    },
  }));

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.headingRow}>
          <AppText as="h1" variant="pageTitle">
            Byggnader
          </AppText>
          <AddBuildingModal />
        </div>
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          Hantera de byggnader som tillhör din organisation.
        </AppText>
      </div>

      {!buildings || buildings.length === 0 ? (
        <div className={styles.empty}>
          <AppText as="p" size="body" color={COLORS.textSecondary}>
            Inga byggnader ännu. Lägg till din första!
          </AppText>
        </div>
      ) : (
        <div className={styles.list}>
          {buildingsWithStats.map((building) => (
            <Link
              key={building.id}
              href={`/dashboard/buildings/${building.id}`}
              className={styles.listItem}
              aria-label={`Visa rum i ${building.name}`}
            >
              <div className={styles.itemIcon} aria-hidden="true">
                🏢
              </div>
              <div className={styles.itemInfo}>
                <AppText as="p" size="body" weight="semiBold">
                  {building.name}
                </AppText>
                {building.address && (
                  <AppText as="p" size="small" color={COLORS.textSecondary}>
                    {building.address}
                  </AppText>
                )}
                <div className={styles.statusRow} aria-label={`Städstatus för ${building.name}`}>
                  <AppText as="span" size="small" color={COLORS.success}>
                    🟢 {building.stats.clean}
                  </AppText>
                  <AppText as="span" size="small" color={COLORS.warning}>
                    🟡 {building.stats.due}
                  </AppText>
                  <AppText as="span" size="small" color={COLORS.error}>
                    🔴 {building.stats.overdue}
                  </AppText>
                </div>
              </div>
              <AppText
                as="span"
                size="small"
                weight="semiBold"
                color={COLORS.link}
                style={{ marginLeft: "auto" }}
              >
                Visa rum
              </AppText>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
