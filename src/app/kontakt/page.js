import { COLORS, SPACING } from "@/constants";
import AppText from "@/components/ui/AppText";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import AppButton from "@/components/ui/AppButton";

export const metadata = {
  title: "Kontakt – StädAppen",
};

export default function ContactPage() {
  return (
    <div style={{ background: COLORS.backgroundSecondary, minHeight: "100dvh" }}>
      <SiteHeader />

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${SPACING.x10}px ${SPACING.x4}px`,
          display: "grid",
          gap: SPACING.x4,
        }}
      >
        <AppText as="h1" variant="pageTitle">
          Kontakt
        </AppText>
        <AppText as="p" variant="body" style={{ color: COLORS.textSecondary }}>
          Vill du se en demo eller komma igång? Hör av dig så hjälper vi dig att
          sätta upp organisation, byggnader och QR-flöde.
        </AppText>

        <div style={{ display: "flex", gap: SPACING.x3, flexWrap: "wrap" }}>
          <AppButton
            variant="primary"
            size="small"
            href="mailto:demo@stadappen.se"
          >
            Mejla oss
          </AppButton>
          <AppButton variant="ghost" size="small" href="/signup">
            Skapa konto
          </AppButton>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

