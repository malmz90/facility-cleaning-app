import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import {
  annotateRoomsWithStatus,
  buildLastCleanedMap,
  formatRelativeTime,
  ROOM_STATUS_META,
  sortRoomsByStatus,
} from "@/lib/room-status";
import styles from "./page.module.css";

const CLEANING_FREQUENCY_LABELS = {
  daily: "Städning: Dagligen",
  weekly: "Städning: 1 gång i veckan",
  monthly: "Städning: 1 gång i månaden",
  on_demand: "Städning: Vid behov",
};

function getCleaningFrequencyLabel(value) {
  return CLEANING_FREQUENCY_LABELS[value] ?? `Städning: ${value}`;
}

const ROOM_FILTERS = [
  { key: "all", label: "Alla" },
  { key: "clean", label: "Nyligen städat" },
  { key: "due", label: "Snart dags" },
  { key: "overdue", label: "Behöver städas" },
];

function getStatusBadgeClass(status) {
  if (status === "overdue") return styles.statusOverdue;
  if (status === "due") return styles.statusDue;
  return styles.statusClean;
}

export default async function BuildingDetailPage({ params, searchParams }) {
  const { buildingId } = await params;
  const resolvedSearchParams = await searchParams;
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

  const { data: building } = await supabase
    .from("buildings")
    .select("id, name, address")
    .eq("id", buildingId)
    .eq("organization_id", orgId)
    .single();

  if (!building) {
    redirect("/dashboard/buildings");
  }

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, cleaning_frequency, qr_code_id")
    .eq("building_id", buildingId)
    .order("created_at", { ascending: false });

  const roomIds = rooms?.map((room) => room.id) ?? [];
  let cleaningLogs = [];
  let roomInstructions = [];

  if (roomIds.length > 0) {
    const { data: cleaningLogData } = await supabase
      .from("cleaning_logs")
      .select("room_id, cleaned_at")
      .in("room_id", roomIds);
    cleaningLogs = cleaningLogData ?? [];

    const { data: roomInstructionData } = await supabase
      .from("room_instructions")
      .select("room_id, text, order_index, created_at")
      .in("room_id", roomIds)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });
    roomInstructions = roomInstructionData ?? [];
  }

  const instructionsByRoomId = new Map();
  for (const instruction of roomInstructions) {
    if (!instruction?.room_id || !instruction?.text) continue;
    const current = instructionsByRoomId.get(instruction.room_id) ?? [];
    current.push(instruction.text.trim());
    instructionsByRoomId.set(instruction.room_id, current);
  }

  const roomsWithInstructions = (rooms ?? []).map((room) => ({
    ...room,
    instructions: instructionsByRoomId.get(room.id) ?? [],
  }));

  const lastCleanedByRoom = buildLastCleanedMap(cleaningLogs);
  const roomsWithStatus = sortRoomsByStatus(
    annotateRoomsWithStatus(roomsWithInstructions, lastCleanedByRoom),
  );

  const activeFilter = ROOM_FILTERS.some((filter) => filter.key === resolvedSearchParams?.status)
    ? resolvedSearchParams.status
    : "all";

  const visibleRooms =
    activeFilter === "all"
      ? roomsWithStatus
      : roomsWithStatus.filter((room) => room.status === activeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard/buildings" className={styles.backLink}>
          <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
          Tillbaka till byggnader
        </Link>
        <AppText as="h1" variant="pageTitle">
          {building.name}
        </AppText>
        {building.address ? (
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            {building.address}
          </AppText>
        ) : (
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Ingen adress angiven
          </AppText>
        )}
      </div>

      <div className={styles.divider} />

      {!rooms || rooms.length === 0 ? (
        <div className={styles.empty}>
          <AppText as="p" size="body" color={COLORS.textSecondary}>
            Inga rum har lagts till ännu.
          </AppText>
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Lägg till rum genom att skanna QR-kod i mobilappen.
          </AppText>
        </div>
      ) : (
        <>
          <div className={styles.filterTabs} role="tablist" aria-label="Filtrera rum efter status">
            {ROOM_FILTERS.map((filter) => {
              const href =
                filter.key === "all"
                  ? `/dashboard/buildings/${buildingId}`
                  : `/dashboard/buildings/${buildingId}?status=${filter.key}`;
              const isActive = activeFilter === filter.key;
              return (
                <Link
                  key={filter.key}
                  href={href}
                  className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>

          {visibleRooms.length === 0 ? (
            <div className={styles.empty}>
              <AppText as="p" size="small" color={COLORS.textSecondary}>
                Inga rum matchar det valda filtret.
              </AppText>
            </div>
          ) : (
            <div className={styles.list}>
              {visibleRooms.map((room) => {
                const statusMeta = ROOM_STATUS_META[room.status] ?? ROOM_STATUS_META.clean;
                return (
                  <div key={room.id} className={styles.roomCard}>
                    <div className={styles.roomCardHeader}>
                      <AppText as="h2" size="body" weight="semiBold">
                        {room.name}
                      </AppText>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(room.status)}`}>
                        <AppText as="span" size="small" weight="semiBold">
                          {statusMeta.emoji} {statusMeta.label}
                        </AppText>
                      </span>
                    </div>

                    <span className={styles.frequencyBadge}>
                      <AppText as="span" size="small" color={COLORS.primary}>
                        {getCleaningFrequencyLabel(room.cleaning_frequency)}
                      </AppText>
                    </span>

                    <AppText as="p" size="small" color={COLORS.textSecondary}>
                      Senast städat: {formatRelativeTime(room.last_cleaned)}
                    </AppText>

                    {room.instructions.length > 0 ? (
                      <AppText as="p" size="small" color={COLORS.textSecondary}>
                        {room.instructions.length > 1 ? "Instruktioner" : "Instruktion"}:{" "}
                        {room.instructions.join(" • ")}
                      </AppText>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
