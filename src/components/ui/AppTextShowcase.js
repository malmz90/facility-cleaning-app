"use client";

import AppText from "@/components/ui/AppText";

const samples = [
  {
    variant: "pageTitle",
    as: "h2",
    text: "pageTitle - huvudrubrik for sida",
  },
  {
    variant: "pageSubtitle",
    as: "h3",
    text: "pageSubtitle - underrubrik under huvudtitel",
  },
  {
    variant: "sectionHeading",
    as: "h4",
    text: "sectionHeading - rubrik for sektioner i innehall",
  },
  {
    variant: "cardHeading",
    as: "h4",
    text: "cardHeading - rubrik i cards/list-items",
  },
  {
    variant: "lead",
    as: "p",
    text: "lead - stor brodtext for viktiga budskap",
  },
  {
    variant: "leadStrong",
    as: "p",
    text: "leadStrong - stor brodtext med tydlig betoning",
  },
  {
    variant: "body",
    as: "p",
    text: "body - standardtext for normala stycken",
  },
  {
    variant: "bodyStrong",
    as: "p",
    text: "bodyStrong - standardtext med semibold vikt",
  },
  {
    variant: "bodyLink",
    as: "p",
    text: "bodyLink - textstil for inline-lankar/action-text",
  },
  {
    variant: "caption",
    as: "p",
    text: "caption - mindre text for hjalptext och metadata",
  },
  {
    variant: "captionStrong",
    as: "p",
    text: "captionStrong - liten text med starkare vikt",
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
      <AppText as="h3" variant="sectionHeading">
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
