import Image from "next/image";
import AppText from "@/components/ui/AppText";
import AppButton from "@/components/ui/AppButton";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { COLORS } from "@/constants";
import styles from "./home.module.css";

export const metadata = {
  title: "StädAppen – Digital lösning för städbranschen",
  description:
    "Ersätt papper och penna med StädAppen. QR-koder per rum, tydliga instruktioner för personalen och full överblick för chefer.",
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      {/* Hero section – background image only here */}
      <section className={styles.heroBg}>
        <Image
          src="/background1.png"
          alt=""
          fill
          priority
          className={styles.heroBgImage}
          aria-hidden="true"
        />
        <div className={styles.heroBgOverlay} />

        <div className={styles.heroBgInner}>
          <div className={styles.hero}>
            <AppText as="h1" variant="pageTitle">
              Digital städlösning – ersätt papper och penna
            </AppText>

            <AppText
              as="p"
              variant="lead"
              style={{ color: COLORS.textSecondary }}
            >
              Skanna en QR-kod vid rummet, få tydliga instruktioner och logga
              utförd städning. Få en överblick – vem städat, vad som återstår
              och när.
            </AppText>

            <div className={styles.ctaRow}>
              <AppButton href="/signup" variant="primary" size="small">
                Kom igång gratis
              </AppButton>
              <AppButton href="/login" variant="ghost" size="small">
                Logga in
              </AppButton>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        {/* Placeholder – content added later */}
      </main>

      <SiteFooter />
    </div>
  );
}
