"use client";

import { useId, useState } from "react";
import Link from "next/link";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import styles from "./SiteHeader.module.css";

export default function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.mobileNav}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label={isOpen ? "Stang meny" : "Oppna meny"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.menuIcon} aria-hidden="true" />
      </button>

      <nav
        id={menuId}
        aria-label="Mobilmeny"
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}
      >
        <Link href="/om-oss" className={styles.mobileMenuLink} onClick={handleClose}>
          <AppText as="span" variant="body">
            Om oss
          </AppText>
        </Link>
        <Link href="/kontakt" className={styles.mobileMenuLink} onClick={handleClose}>
          <AppText as="span" variant="body">
            Kontakt
          </AppText>
        </Link>
        <AppButton href="/login" variant="ghost" onPress={handleClose}>
          Logga in
        </AppButton>
      </nav>
    </div>
  );
}
