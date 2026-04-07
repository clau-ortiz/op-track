import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MineAsset Tracker",
  description: "Gestión de activos críticos para minería"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
