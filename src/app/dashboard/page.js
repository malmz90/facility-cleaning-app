"use client";

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

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.headingRow}>
          <AppText as="h1" variant="pageTitle">
            Översikt
          </AppText>
        </div>
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
    </div>
  );
}
