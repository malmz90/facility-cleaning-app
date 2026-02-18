import "./globals.css";
import Providers from "@/app/providers";
import { appFontClassName } from "@/styles/fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={appFontClassName}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
