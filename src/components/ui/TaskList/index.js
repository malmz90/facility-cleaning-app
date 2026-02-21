import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

/**
 * TaskRow — a single row inside a TaskList.
 * Exported separately so callers can render individual rows if needed.
 */
export function TaskRow({ title, location, status, statusColor, statusBg }) {
  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <AppText as="p" size="body" weight="medium" color={COLORS.textPrimary}>
          {title}
        </AppText>
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          {location}
        </AppText>
      </div>
      <span
        className={styles.badge}
        style={{ color: statusColor, backgroundColor: statusBg }}
      >
        {status}
      </span>
    </div>
  );
}

/**
 * TaskList — a card section that renders a list of TaskRows.
 *
 * @example
 * <TaskList heading="Dagens uppdrag" tasks={tasks} />
 *
 * where tasks = [{ id, title, location, status, statusColor, statusBg }]
 */
export default function TaskList({ heading = "Uppdrag", tasks = [] }) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <AppText as="h2" variant="cardHeading">
          {heading}
        </AppText>
      </div>
      <div className={styles.body}>
        {tasks.length === 0 ? (
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Inga uppdrag att visa.
          </AppText>
        ) : (
          tasks.map((task) => <TaskRow key={task.id} {...task} />)
        )}
      </div>
    </div>
  );
}
