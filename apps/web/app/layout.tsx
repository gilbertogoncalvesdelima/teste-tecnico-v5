// apps/web/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Imobiliário",
  description: "Imóveis de alto padrão em São Paulo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
