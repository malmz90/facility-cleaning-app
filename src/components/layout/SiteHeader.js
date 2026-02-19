import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/constants";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import MobileNavMenu from "./MobileNavMenu";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header
      className={styles.header}
      style={{
        background: COLORS.backgroundPrimary,
        borderBottom: `1px solid ${COLORS.borderSubtle}`,
      }}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="StädAppen"
            width={36}
            height={36}
            priority
          />
          <AppText as="span" variant="bodyStrong" style={{ color: COLORS.primary }}>
            StädAppen
          </AppText>
        </Link>

        <nav aria-label="Huvudmeny" className={styles.nav}>
          <Link href="/om-oss" className={styles.navLink}>
            <AppText as="span" variant="body">
              Om oss
            </AppText>
          </Link>
          <Link href="/kontakt" className={styles.navLink}>
            <AppText as="span" variant="body">
              Kontakt
            </AppText>
          </Link>
        </nav>

        <div className={styles.actions}>
          <AppButton href="/login" variant="ghost" size="small">
            Logga in
          </AppButton>
        </div>

        <MobileNavMenu />
      </div>
    </header>
  );
}
