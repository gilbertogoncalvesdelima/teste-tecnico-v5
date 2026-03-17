// packages/shared/domain/Property.ts

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  neighborhood: string;
  /** Preço em CENTAVOS para imóveis padrão, em REAIS para imóveis de luxo (legado) */
  price: number;
  /** true se price está em reais (imóveis >= 5M). Campo adicionado na migração v2. */
  priceInReais?: boolean;
  area: number; // m²
  bedrooms: number;
  suites: number;
  parkingSpots: number;
  status: "available" | "reserved" | "sold";
  notes: string[];
  photos: string[];
  amenities: string[];
  updatedAt: number; // timestamp
  updatedBy: "backoffice" | "field_agent";
}

export interface PropertySummary {
  id: string;
  slug: string;
  title: string;
  neighborhood: string;
  price: number;
  priceInReais?: boolean;
  area: number;
  suites: number;
  photos: string[]; // só primeiras 3
  status: Property["status"];
}
