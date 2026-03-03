"use client";

import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

export default function AppLoader({
  fullScreen = false,
  label = "Kontrollerar session...",
}) {
  return (
    <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ""}`}>
      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden="true" />
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          {label}
        </AppText>
      </div>
    </div>
  );
}
