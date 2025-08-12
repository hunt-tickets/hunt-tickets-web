import { UserProvider } from "@/lib/UserContext";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/soho-dark/theme.css";
import "react-date-picker/dist/DatePicker.css";
import "react-modern-drawer/dist/index.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `Hunt Tickets`,
  description: `Eventos bien cool`,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-black font-sans antialiased",
          fontSans.variable
        )}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
