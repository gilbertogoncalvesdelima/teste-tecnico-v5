import type { Property, PropertySummary } from "@repo/shared/domain/Property";
import {
  getMockSummaries,
  mockProperties,
} from "../app/api/properties/mockData";

export type PropertyFilters = {
  neighborhoods?: string[];
  priceMin?: number;
  priceMax?: number;
  suitesMin?: number;
  areaMin?: number;
};

export function getPropertiesFromMockServer(
  filters?: PropertyFilters
): PropertySummary[] {
  let list = getMockSummaries();

  if (filters?.neighborhoods?.length) {
    list = list.filter((p) =>
      filters.neighborhoods!.some(
        (n) => p.neighborhood.toLowerCase() === n.toLowerCase()
      )
    );
  }
  if (filters?.priceMin !== undefined && !Number.isNaN(filters.priceMin)) {
    list = list.filter(
      (p) => (p.priceInReais ? p.price : p.price / 100) >= filters.priceMin!
    );
  }
  if (filters?.priceMax !== undefined && !Number.isNaN(filters.priceMax)) {
    list = list.filter(
      (p) => (p.priceInReais ? p.price : p.price / 100) <= filters.priceMax!
    );
  }
  if (filters?.suitesMin !== undefined && !Number.isNaN(filters.suitesMin)) {
    list = list.filter((p) => p.suites >= filters.suitesMin!);
  }
  if (filters?.areaMin !== undefined && !Number.isNaN(filters.areaMin)) {
    list = list.filter((p) => p.area >= filters.areaMin!);
  }

  return list;
}

export function getPropertyBySlugFromMock(slug: string): Property | null {
  return mockProperties.find((p) => p.slug === slug) ?? null;
}
