"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters } from "./SearchFilters";
import { ImoveisListClient } from "./ImoveisListClient";
import type { PropertySummary } from "@repo/shared/domain/Property";

const SORT_OPTIONS = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "recent", label: "Mais recentes" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

interface ImoveisLayoutProps {
  properties: PropertySummary[];
}

export function ImoveisLayout({ properties }: ImoveisLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get("sort") as SortKey) || "relevance";
  const validSort = SORT_OPTIONS.some((o) => o.value === sort) ? sort : "relevance";

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    router.push(`/imoveis?${next.toString()}`);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        background: "#f5f5f5",
        margin: "0 -16px -24px",
        padding: "24px 16px",
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          background: "#fff",
          borderRadius: 8,
          padding: "20px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", color: "#111" }}>
          Imóveis
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 16px 0" }}>
          {properties.length} resultado{properties.length !== 1 ? "s" : ""}
        </p>
        <SearchFilters properties={properties} />
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#111" }}>
            Ordenar por
            <select
              value={validSort}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                fontSize: 14,
                cursor: "pointer",
              }}
              data-testid="sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ImoveisListClient properties={properties} sort={validSort} />
      </div>
    </div>
  );
}
