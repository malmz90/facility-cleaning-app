"use client";

import AppText from "@/components/ui/AppText";

const samples = [
  {
    variant: "screenTitle",
    as: "h2",
    text: "screenTitle - huvudrubrik for screen/page",
  },
  {
    variant: "screenSubtitle",
    as: "h3",
    text: "screenSubtitle - underrubrik under huvudtitel",
  },
  {
    variant: "sectionTitle",
    as: "h4",
    text: "sectionTitle - rubrik for sektioner i innehall",
  },
  {
    variant: "cardTitle",
    as: "h4",
    text: "cardTitle - rubrik i cards/list-items",
  },
  {
    variant: "largeText",
    as: "p",
    text: "largeText - stor brodtext for viktiga budskap",
  },
  {
    variant: "largeTextBold",
    as: "p",
    text: "largeTextBold - stor brodtext med tydlig betoning",
  },
  {
    variant: "bodyText",
    as: "p",
    text: "bodyText - standardtext for normala stycken",
  },
  {
    variant: "bodyTextBold",
    as: "p",
    text: "bodyTextBold - standardtext med semibold vikt",
  },
  {
    variant: "bodyTextLink",
    as: "p",
    text: "bodyTextLink - textstil for inline-lankar/action-text",
  },
  {
    variant: "smallText",
    as: "p",
    text: "smallText - mindre text for hjalptext och metadata",
  },
  {
    variant: "smallTextBold",
    as: "p",
    text: "smallTextBold - liten text med starkare vikt",
  },
];

export default function AppTextShowcase() {
  return (
    <section
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gap: 10,
      }}
    >
      <AppText as="h3" variant="sectionTitle">
        AppText variants demo
      </AppText>

      {samples.map((sample) => (
        <div key={sample.variant}>
          <AppText as={sample.as} variant={sample.variant}>
            {sample.text}
          </AppText>
        </div>
      ))}
    </section>
  );
}
