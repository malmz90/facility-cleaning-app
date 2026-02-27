import { createClient } from "@/lib/supabase/server";
import AppText from "@/components/ui/AppText";
import AddBuildingModal from "@/components/ui/AddBuildingModal";
import { COLORS } from "@/constants";
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
          {buildings.map((b) => (
            <div key={b.id} className={styles.listItem}>
              <div className={styles.itemIcon} aria-hidden="true">
                🏢
              </div>
              <div className={styles.itemInfo}>
                <AppText as="p" size="body" weight="semiBold">
                  {b.name}
                </AppText>
                {b.address && (
                  <AppText as="p" size="small" color={COLORS.textSecondary}>
                    {b.address}
                  </AppText>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
