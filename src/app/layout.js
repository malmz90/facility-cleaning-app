import "./globals.css";
import Providers from "@/app/providers";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
