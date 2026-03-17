// apps/web/app/imoveis/page.tsx
// ⚠️ MÓDULO 2A: Refatore para Server Component
"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "./components/PropertyCard";
import type { PropertySummary } from "@repo/shared/domain/Property";

export default function ImoveisPage() {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // BUG: Deveria ser Server Component com fetch direto
  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Imóveis</h1>

      {/* TODO: SearchFilters vai aqui (Módulo 3) */}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {properties.map((prop) => (
          <PropertyCard
            key={prop.id}
            property={prop}
            onFavorite={toggleFavorite}
            isFavorited={favorites.has(prop.id)}
          />
        ))}
      </div>
    </div>
  );
}
