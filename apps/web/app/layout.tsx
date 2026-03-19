// apps/web/app/layout.tsx
import type { Metadata } from "next";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "Portal Imobiliário",
  description: "Imóveis de alto padrão em São Paulo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <SiteHeader />
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
