"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { PropertySummary } from "@repo/shared/domain/Property";

const NEIGHBORHOOD_NAMES = [
  "Jardins",
  "Vila Madalena",
  "Pinheiros",
  "Itaim Bibi",
  "Moema",
  "Vila Olímpia",
  "Brooklin",
  "Campo Belo",
  "Vila Nova Conceição",
  "Perdizes",
  "Alto de Pinheiros",
  "Consolação",
];
const SUITE_VALUES = ["", "1", "2", "3", "4", "5"];
const SUITE_LABELS: Record<string, string> = {
  "": "Qualquer",
  "1": "1+",
  "2": "2+",
  "3": "3+",
  "4": "4+",
  "5": "5+",
};
const AREA_OPTIONS_M2 = [50, 80, 100, 120, 150, 200];

function parseNeighborhoods(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").map((s) => s.trim()).filter(Boolean);
}

function formatPriceForDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  return Number(digits).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function parsePriceFromInput(displayValue: string): string {
  const digits = displayValue.replace(/\D/g, "");
  return digits === "" ? "" : digits;
}

interface SearchFiltersProps {
  properties?: PropertySummary[];
}

export function SearchFilters({ properties = [] }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countByNeighborhood = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of properties) {
      const n = p.neighborhood;
      map.set(n, (map.get(n) ?? 0) + 1);
    }
    return map;
  }, [properties]);

  const countBySuites = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of SUITE_VALUES) {
      if (v === "") continue;
      const min = Number(v);
      map.set(v, properties.filter((p) => p.suites >= min).length);
    }
    return map;
  }, [properties]);

  const countByArea = useMemo(() => {
    const map = new Map<number, number>();
    for (const m2 of AREA_OPTIONS_M2) {
      map.set(m2, properties.filter((p) => p.area >= m2).length);
    }
    return map;
  }, [properties]);

  const neighborhood = searchParams.get("neighborhood") ?? "";
  const selectedNeighborhoods = parseNeighborhoods(neighborhood || null);
  const neighborhoodOptions = useMemo(
    () =>
      NEIGHBORHOOD_NAMES.filter(
        (name) =>
          selectedNeighborhoods.includes(name) || (countByNeighborhood.get(name) ?? 0) > 0
      ),
    [selectedNeighborhoods, countByNeighborhood]
  );
  const priceMin = searchParams.get("price_min") ?? "";
  const priceMax = searchParams.get("price_max") ?? "";
  const suitesMin = searchParams.get("suites_min") ?? "";
  const areaMin = searchParams.get("area_min") ?? "";

  const suitesFilterActive = suitesMin !== "";
  const suiteOptions = useMemo(
    () => (suitesFilterActive ? [suitesMin] : SUITE_VALUES),
    [suitesFilterActive, suitesMin]
  );

  const areaFilterActive = areaMin !== "" && !Number.isNaN(Number(areaMin));
  const areaOptions = useMemo(
    () =>
      areaFilterActive && areaMin !== ""
        ? [Number(areaMin)]
        : AREA_OPTIONS_M2,
    [areaFilterActive, areaMin]
  );

  const minNum = valueAsNumber(priceMin);
  const maxNum = valueAsNumber(priceMax);
  const priceError =
    minNum !== undefined && maxNum !== undefined && minNum > maxNum
      ? "Preço mínimo não pode ser maior que o máximo"
      : null;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const url = `/imoveis?${next.toString()}`;
      router.push(url);
      router.refresh();
    },
    [router, searchParams]
  );

  const handleNeighborhoodToggle = (name: string, checked: boolean) => {
    const next = checked
      ? [...selectedNeighborhoods, name].sort()
      : selectedNeighborhoods.filter((n) => n !== name);
    updateParams({ neighborhood: next.join(",") });
  };

  const handlePriceMinChange = (displayValue: string) => {
    updateParams({ price_min: parsePriceFromInput(displayValue) });
  };

  const handlePriceMaxChange = (displayValue: string) => {
    updateParams({ price_max: parsePriceFromInput(displayValue) });
  };

  const handleSuitesChange = (value: string) => {
    updateParams({ suites_min: value });
  };

  const handleAreaMinChange = (value: string) => {
    updateParams({ area_min: value });
  };

  const handleClear = () => {
    router.push("/imoveis");
    router.refresh();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
      data-testid="search-filters"
    >
      <a
        href="#"
        style={{ fontSize: 14, color: "#3483fa", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
        onClick={(e) => e.preventDefault()}
      >
        <span aria-hidden>🔖</span>
        Salvar esta busca
      </a>

      <section>
        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10, color: "#111" }}>
          Bairro
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {neighborhoodOptions.map((name) => {
            const count = countByNeighborhood.get(name) ?? 0;
            return (
              <label key={name} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={selectedNeighborhoods.includes(name)}
                  onChange={(e) => handleNeighborhoodToggle(name, e.target.checked)}
                  data-testid={`filter-neighborhood-${name.replace(/\s/g, "-")}`}
                />
                <span>{name} ({count.toLocaleString("pt-BR")})</span>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8, color: "#111" }}>
          Preço (R$)
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            inputMode="numeric"
            value={formatPriceForDisplay(priceMin)}
            onChange={(e) => handlePriceMinChange(e.target.value)}
            placeholder="Mín."
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: priceError ? "1px solid #ef4444" : "1px solid #e2e8f0",
              width: "100%",
              boxSizing: "border-box",
            }}
            data-testid="filter-price-min"
          />
          <input
            type="text"
            inputMode="numeric"
            value={formatPriceForDisplay(priceMax)}
            onChange={(e) => handlePriceMaxChange(e.target.value)}
            placeholder="Máx."
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: priceError ? "1px solid #ef4444" : "1px solid #e2e8f0",
              width: "100%",
              boxSizing: "border-box",
            }}
            data-testid="filter-price-max"
          />
          {priceError && (
            <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }} data-testid="price-validation-error">
              {priceError}
            </p>
          )}
        </div>
      </section>

      <section>
        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10, color: "#111" }}>
          Suítes (mín.)
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {suiteOptions.map((value) => {
            const showCount = !suitesFilterActive;
            const count = value === "" ? properties.length : (countBySuites.get(value) ?? 0);
            const label =
              showCount
                ? value === ""
                  ? `Qualquer (${properties.length.toLocaleString("pt-BR")})`
                  : `${SUITE_LABELS[value]} (${count.toLocaleString("pt-BR")})`
                : SUITE_LABELS[value];
            return (
              <label
                key={value || "any"}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}
              >
                {suitesFilterActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSuitesChange("");
                    }}
                    aria-label="Limpar suítes"
                    data-testid="filter-suites-clear"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      color: "#94a3b8",
                      fontSize: 16,
                      lineHeight: 1,
                      cursor: "pointer",
                      borderRadius: "50%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    ×
                  </button>
                )}
                <input
                  type="radio"
                  name="suites_min"
                  checked={suitesMin === value}
                  onChange={() => handleSuitesChange(value)}
                  data-testid={value ? `filter-suites-${value}` : "filter-suites-any"}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10, color: "#111" }}>
          Área mín. (m²)
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {!areaFilterActive && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input
                type="radio"
                name="area_min"
                checked={areaMin === ""}
                onChange={() => handleAreaMinChange("")}
                data-testid="filter-area-any"
              />
              <span>Qualquer ({properties.length.toLocaleString("pt-BR")})</span>
            </label>
          )}
          {areaOptions.map((m2) => {
            const count = countByArea.get(m2) ?? 0;
            const isSelected = areaMin === String(m2);
            const showCount = !areaFilterActive;
            const label = showCount ? `${m2} m² (${count.toLocaleString("pt-BR")})` : `${m2} m²`;
            return (
              <label
                key={m2}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}
              >
                {areaFilterActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAreaMinChange("");
                    }}
                    aria-label="Limpar área"
                    data-testid="filter-area-clear"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      color: "#94a3b8",
                      fontSize: 16,
                      lineHeight: 1,
                      cursor: "pointer",
                      borderRadius: "50%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    ×
                  </button>
                )}
                <input
                  type="radio"
                  name="area_min"
                  checked={isSelected}
                  onChange={() => handleAreaMinChange(String(m2))}
                  data-testid={`filter-area-${m2}`}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={handleClear}
        style={{
          padding: "10px 16px",
          fontSize: 14,
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          background: "#f8fafc",
          cursor: "pointer",
          width: "100%",
          color: "#333",
        }}
        data-testid="filter-clear"
      >
        Limpar filtros
      </button>
    </div>
  );
}

function valueAsNumber(s: string): number | undefined {
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}
