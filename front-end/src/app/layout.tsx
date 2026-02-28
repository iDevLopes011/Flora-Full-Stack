import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flora Dictionary",
  description:
    "Um dicionário moderno construído com a identidade visual da Flora.",
  icons: {
    icon: "/Flora_Logo_Preferencial_Negativo_RGB.svg",
  },
};

import { Navbar } from "@/components/layout/Navbar/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
