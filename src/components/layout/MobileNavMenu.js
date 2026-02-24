"use client";

import Link from "next/link";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import styles from "./SiteHeader.module.css";

export default function MobileNavMenu() {
  return (
    <div className={styles.mobileNav}>
      <HamburgerMenu ariaLabel="Öppna meny">
        {(close) => (
          <>
            <Link href="/om-oss" className={styles.mobileMenuLink} onClick={close}>
              <AppText as="span" variant="body">
                Om oss
              </AppText>
            </Link>
            <Link href="/kontakt" className={styles.mobileMenuLink} onClick={close}>
              <AppText as="span" variant="body">
                Kontakt
              </AppText>
            </Link>
            <AppButton href="/login" variant="ghost" onPress={close}>
              Logga in
            </AppButton>
          </>
        )}
      </HamburgerMenu>
    </div>
  );
}
