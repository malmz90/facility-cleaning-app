"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import StatCard from "@/components/ui/StatCard";
import TaskList from "@/components/ui/TaskList";
import { COLORS } from "@/constants";
import styles from "./page.module.css";

const STATS = [
  { label: "Tilldelade uppdrag", value: "12", color: COLORS.primary },
  { label: "Slutförda idag", value: "5", color: COLORS.success },
  { label: "Väntande", value: "7", color: COLORS.warning },
  { label: "Objekt", value: "3", color: COLORS.info },
];

const TASKS = [
  {
    id: 1,
    title: "Kontorslokal A, plan 3",
    location: "Kungsgatan 14",
    status: "Pågående",
    statusColor: COLORS.primary,
    statusBg: "#e6f3f4",
  },
  {
    id: 2,
    title: "Entré & reception",
    location: "Storgatan 5",
    status: "Klar",
    statusColor: COLORS.success,
    statusBg: COLORS.successSurface,
  },
  {
    id: 3,
    title: "Konferensrum 2–4",
    location: "Kungsgatan 14",
    status: "Väntande",
    statusColor: COLORS.warning,
    statusBg: COLORS.warningSurface,
  },
  {
    id: 4,
    title: "Personalmatsal",
    location: "Fabriksgatan 2",
    status: "Väntande",
    statusColor: COLORS.warning,
    statusBg: COLORS.warningSurface,
  },
];

function getInitials(email) {
  return email ? email[0].toUpperCase() : "?";
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
          <AppText as="span" size="body" weight="semiBold" color={COLORS.primary}>
            StädAppen
          </AppText>

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
              style={{ maxWidth: 200 }}
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
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <TaskList heading="Dagens uppdrag" tasks={TASKS} />
      </main>
    </div>
  );
}
