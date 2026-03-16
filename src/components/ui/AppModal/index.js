"use client";

import { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

/**
 * Reusable modal shell.
 * Handles backdrop click, Escape key, ARIA attributes.
 * Renders nothing when closed.
 *
 * @param {{ isOpen: boolean, onClose: () => void, title: string, titleId: string, children: React.ReactNode }} props
 */
export default function AppModal({ isOpen, onClose, title, titleId, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.modalHeader}>
          <AppText as="h2" size="body" weight="semiBold" id={titleId}>
            {title}
          </AppText>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Stäng"
          >
            <XIcon size={20} color={COLORS.textSecondary} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
