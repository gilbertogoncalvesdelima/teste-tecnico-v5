"use client";

import { useState, useEffect, useMemo } from "react";
import { PropertyCard } from "./PropertyCard";
import type { PropertySummary } from "@repo/shared/domain/Property";
import type { SortKey } from "./ImoveisLayout";

const INITIAL_PAGE_SIZE = 6;
const LOAD_MORE_SIZE = 6;

function priceInReais(p: PropertySummary): number {
  return p.priceInReais ? p.price : p.price / 100;
}

function sortProperties(list: PropertySummary[], sort: SortKey): PropertySummary[] {
  if (sort === "relevance") return list;
  const arr = [...list];
  if (sort === "price_asc") arr.sort((a, b) => priceInReais(a) - priceInReais(b));
  else if (sort === "price_desc") arr.sort((a, b) => priceInReais(b) - priceInReais(a));
  else if (sort === "recent") arr.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return arr;
}

interface ImoveisListClientProps {
  properties: PropertySummary[];
  sort: SortKey;
}

export function ImoveisListClient({ properties, sort }: ImoveisListClientProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  const sorted = useMemo(() => sortProperties(properties, sort), [properties, sort]);

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [properties.length, properties[0]?.id]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {visible.map((prop) => (
          <PropertyCard
            key={prop.id}
            property={prop}
            onFavorite={toggleFavorite}
            isFavorited={favorites.has(prop.id)}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_SIZE)}
            style={{
              padding: "12px 32px",
              fontSize: 14,
              fontWeight: 500,
              color: "#1a5fb4",
              background: "#fff",
              border: "1px solid #1a5fb4",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}
