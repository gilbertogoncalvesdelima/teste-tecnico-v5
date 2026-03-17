// apps/web/lib/types.ts

export interface SearchFiltersState {
  neighborhoods: string[];
  priceMin?: number;
  priceMax?: number;
  suitesMin?: number;
  areaMin?: number;
}

export const NEIGHBORHOODS = [
  "Jardins",
  "Itaim Bibi",
  "Vila Nova Conceição",
  "Moema",
  "Pinheiros",
  "Brooklin",
] as const;

export type Neighborhood = (typeof NEIGHBORHOODS)[number];
