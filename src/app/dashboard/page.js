"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import { COLORS, SPACING } from "@/constants";
import styles from "./page.module.css";

const STATS = [
  { label: "Tilldelade uppdrag", value: "12", color: COLORS.primary },
  { label: "Slutförda idag", value: "5", color: COLORS.success },
  { label: "Väntande", value: "7", color: COLORS.warning },
  { label: "Objekt", value: "3", color: COLORS.info },
];

const TASKS = [
  { id: 1, title: "Kontorslokal A, plan 3", location: "Kungsgatan 14", status: "Pågående", statusColor: COLORS.primary, statusBg: "#e6f3f4" },
  { id: 2, title: "Entré & reception", location: "Storgatan 5", status: "Klar", statusColor: COLORS.success, statusBg: COLORS.successSurface },
  { id: 3, title: "Konferensrum 2–4", location: "Kungsgatan 14", status: "Väntande", statusColor: COLORS.warning, statusBg: COLORS.warningSurface },
  { id: 4, title: "Personalmatsal", location: "Fabriksgatan 2", status: "Väntande", statusColor: COLORS.warning, statusBg: COLORS.warningSurface },
];

function getInitials(email) {
  if (!email) return "?";
  return email[0].toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <AppText as="span" size="body" weight="semiBold" color={COLORS.primary}>
              FacilityClean
            </AppText>
          </div>

          <div className={styles.userRow}>
            <div className={styles.avatar}>
              <AppText as="span" size="small" weight="semiBold" color="#ffffff">
                {getInitials(user?.email)}
              </AppText>
            </div>
            <AppText
              as="span"
              size="small"
              color={COLORS.textSecondary}
              numberOfLines={1}
              style={{ maxWidth: 180 }}
            >
              {user?.email}
            </AppText>
            <AppButton variant="ghost" size="small" onPress={handleLogout}>
              Logga ut
            </AppButton>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.greeting}>
          <AppText as="h1" variant="pageTitle">
            Översikt
          </AppText>
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Här ser du dina tilldelade uppdrag och status för dagen.
          </AppText>
        </div>

        <div className={styles.statsGrid}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statDot} style={{ backgroundColor: stat.color }} />
              <AppText as="p" variant="pageTitle" style={{ color: stat.color }}>
                {stat.value}
              </AppText>
              <AppText as="p" size="small" color={COLORS.textSecondary}>
                {stat.label}
              </AppText>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <AppText as="h2" variant="cardHeading">
              Dagens uppdrag
            </AppText>
          </div>
          <div className={styles.sectionBody}>
            {TASKS.map((task) => (
              <div key={task.id} className={styles.taskRow}>
                <div className={styles.taskInfo}>
                  <AppText as="p" size="body" weight="medium" color={COLORS.textPrimary}>
                    {task.title}
                  </AppText>
                  <AppText as="p" size="small" color={COLORS.textSecondary}>
                    {task.location}
                  </AppText>
                </div>
                <span
                  className={styles.taskBadge}
                  style={{ color: task.statusColor, backgroundColor: task.statusBg }}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
