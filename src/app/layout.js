import "./globals.css";
import Providers from "@/app/providers";
import { Inter, Roboto_Serif } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} ${robotoSerif.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
