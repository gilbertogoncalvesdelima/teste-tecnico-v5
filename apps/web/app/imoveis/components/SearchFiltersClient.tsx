"use client";

import { useRouter, useSearchParams } from "next/navigation";

const NEIGHBORHOODS = ["Jardins", "Vila Madalena", "Pinheiros", "Itaim Bibi", "Moema"];

export function SearchFiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentNeighborhood = searchParams.get("neighborhood") ?? "";

  const handleNeighborhoodChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set("neighborhood", value);
    } else {
      next.delete("neighborhood");
    }
    router.push(`/imoveis?${next.toString()}`);
  };

  const handleClear = () => {
    router.push("/imoveis");
  };

  return (
    <div style={{ marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <label style={{ fontSize: 14, fontWeight: 500 }}>
        Bairro:
        <select
          value={currentNeighborhood}
          onChange={(e) => handleNeighborhoodChange(e.target.value)}
          style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
        >
          <option value="">Todos</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={handleClear}
        style={{
          padding: "8px 16px",
          fontSize: 14,
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          background: "#f8fafc",
          cursor: "pointer",
        }}
      >
        Limpar filtros
      </button>
    </div>
  );
}
