import { Inter, Roboto_Serif } from "next/font/google";

export const primaryFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const secondaryFont = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const appFontClassName = `${primaryFont.variable} ${secondaryFont.variable}`;
