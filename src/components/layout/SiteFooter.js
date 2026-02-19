import Link from "next/link";
import { COLORS, SPACING } from "@/constants";
import AppText from "@/components/ui/AppText";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: SPACING.x10,
        borderTop: `1px solid ${COLORS.borderSubtle}`,
        background: COLORS.backgroundPrimary,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${SPACING.x6}px ${SPACING.x4}px`,
          display: "grid",
          gap: SPACING.x4,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: SPACING.x4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <AppText as="p" variant="caption" style={{ color: COLORS.textSecondary }}>
            © {year} StädAppen. Digital lösning för städbranschen.
          </AppText>

          <div style={{ display: "flex", gap: SPACING.x4, flexWrap: "wrap" }}>
            <Link href="/om-oss">
              <AppText as="span" variant="caption">
                Om oss
              </AppText>
            </Link>
            <Link href="/kontakt">
              <AppText as="span" variant="caption">
                Kontakt
              </AppText>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

