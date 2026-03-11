import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
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

export default async function BuildingDetailPage({ params }) {
  const { buildingId } = await params;
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
    .select("id, name, cleaning_frequency, instructions, qr_code_id")
    .eq("building_id", buildingId)
    .order("created_at", { ascending: false });

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
        <div className={styles.list}>
          {rooms.map((room) => (
            <div key={room.id} className={styles.roomCard}>
              <AppText as="h2" size="body" weight="semiBold">
                {room.name}
              </AppText>
              <span className={styles.frequencyBadge}>
                <AppText as="span" size="small" color={COLORS.primary}>
                  {getCleaningFrequencyLabel(room.cleaning_frequency)}
                </AppText>
              </span>
              {room.instructions ? (
                <AppText as="p" size="small" color={COLORS.textSecondary}>
                  Instruktion: {room.instructions}
                </AppText>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
