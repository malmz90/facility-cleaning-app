import { createClient } from "@/lib/supabase/server";
import AppText from "@/components/ui/AppText";
import AddEmployeeModal from "@/components/ui/AddEmployeeModal";
import EditEmployeeModal from "@/components/ui/EditEmployeeModal";
import { COLORS } from "@/constants";
import styles from "./page.module.css";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

const ROLE_LABELS = {
  owner: "Ägare",
  admin: "Admin",
  cleaner: "Städare",
};

export default async function EmployeesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_organization_id")
    .eq("id", user.id)
    .single();

  const orgId = profile?.active_organization_id;

  const { data: enrichedMembers } = await supabase
    .from("organization_members")
    .select("user_id, role, profiles(name)")
    .eq("organization_id", orgId)
    .order("role");

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.headingRow}>
          <AppText as="h1" variant="pageTitle">
            Anställda
          </AppText>
          <AddEmployeeModal />
        </div>
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          Här hanterar du din organisations anställda.
        </AppText>
      </div>

      {!enrichedMembers || enrichedMembers.length === 0 ? (
        <div className={styles.empty}>
          <AppText as="p" size="body" color={COLORS.textSecondary}>
            Inga anställda ännu. Lägg till din första!
          </AppText>
        </div>
      ) : (
        <div className={styles.list}>
          {enrichedMembers.map((m) => {
            const name = m.profiles?.name ?? null;
            return (
              <div key={m.user_id} className={styles.listItem}>
                <div className={styles.avatar}>
                  <AppText
                    as="span"
                    size="small"
                    weight="semiBold"
                    color="#ffffff"
                  >
                    {getInitials(name)}
                  </AppText>
                </div>
                <div className={styles.itemInfo}>
                  <AppText as="p" size="body" weight="semiBold">
                    {name ?? "—"}
                  </AppText>
                  <AppText as="p" size="small" color={COLORS.textSecondary}>
                    {ROLE_LABELS[m.role] ?? m.role}
                  </AppText>
                </div>
                <EditEmployeeModal
                  userId={m.user_id}
                  name={name}
                  isCurrentUser={m.user_id === user.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
