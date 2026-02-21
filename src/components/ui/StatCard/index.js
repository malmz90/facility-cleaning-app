import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

/**
 * StatCard — a single metric tile for dashboards.
 *
 * @example
 * <StatCard label="Slutförda idag" value="5" color={COLORS.success} />
 */
export default function StatCard({ label, value, color = COLORS.primary }) {
  return (
    <div className={styles.card}>
      <div className={styles.dot} style={{ backgroundColor: color }} />
      <AppText as="p" variant="pageTitle" style={{ color }}>
        {value}
      </AppText>
      <AppText as="p" size="small" color={COLORS.textSecondary}>
        {label}
      </AppText>
    </div>
  );
}
