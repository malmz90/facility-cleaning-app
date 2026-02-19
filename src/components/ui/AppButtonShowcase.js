"use client";

import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";

export default function AppButtonShowcase() {
  return (
    <section
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <AppText as="h3" variant="sectionHeading">
        AppButton variants demo
      </AppText>

      <AppButton variant="primary">Primary button</AppButton>
      <AppButton variant="secondary">Secondary button</AppButton>
      <AppButton variant="accent">Accent button</AppButton>
      <AppButton variant="social">Social button</AppButton>
      <AppButton variant="overlay">Overlay button</AppButton>
      <AppButton variant="ghost">Ghost button</AppButton>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <AppButton variant="primary" size="small">
          Small
        </AppButton>
        <AppButton variant="primary" disabled>
          Disabled
        </AppButton>
        <AppButton variant="primary" loading>
          Loading
        </AppButton>
      </div>
    </section>
  );
}
