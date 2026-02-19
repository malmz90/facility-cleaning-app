import { COLORS, SPACING } from "@/constants";
import AppText from "@/components/ui/AppText";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export const metadata = {
  title: "Om oss – StädAppen",
  description:
    "StädAppen digitaliserar städbranschen med QR-koder, tydliga instruktioner och realtidsöverblick för chefer.",
};

export default function AboutPage() {
  return (
    <div style={{ background: COLORS.backgroundSecondary, minHeight: "100dvh" }}>
      <SiteHeader />

      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: `${SPACING.x10}px ${SPACING.x4}px`,
          display: "grid",
          gap: SPACING.x4,
        }}
      >
        <AppText as="h1" variant="pageTitle">
          Om StädAppen
        </AppText>
        <AppText as="p" variant="lead" style={{ color: COLORS.textSecondary }}>
          Vi digitaliserar städbranschen – och ersätter papper och penna med ett
          enkelt, spårbart flöde.
        </AppText>
        <AppText as="p" variant="body" style={{ color: COLORS.textSecondary }}>
          Städpersonal skannar en QR-kod vid rummet, får tydliga instruktioner
          och loggar utförd städning direkt i mobilen. Chefer och administratörer
          får full realtidsöverblick: vad som är städat, vad som återstår och av
          vem.
        </AppText>
        <AppText as="p" variant="body" style={{ color: COLORS.textSecondary }}>
          StädAppen är särskilt användbar vid introduktion av ny personal – istället
          för en lång rundgång räcker det att skanna koden och följa instruktionerna
          för just det rummet.
        </AppText>
      </main>

      <SiteFooter />
    </div>
  );
}

