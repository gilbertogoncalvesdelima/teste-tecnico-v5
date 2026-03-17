// apps/web/app/imoveis/components/MapView.tsx
// ⛔ NÃO ALTERE ESTE ARQUIVO
"use client";

export function MapView({ properties }: { properties: { lat: number; lng: number; title: string }[] }) {
  return (
    <div style={{ height: 400, background: "#f1f5f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94a3b8" }}>Mapa — {properties.length} imóveis</p>
    </div>
  );
}
