// apps/mobile/src/stores/propertyStore.ts

import { create } from "zustand";
import type { Property, PropertySummary } from "@repo/shared/domain/Property";

interface PropertyState {
  properties: Record<string, Property>;
  favorites: Set<string>;
  lastSyncAt: number | null;

  // Actions
  setProperties: (properties: Property[]) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  toggleFavorite: (id: string) => void;
  markSynced: () => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: {},
  favorites: new Set(),
  lastSyncAt: null,

  setProperties: (properties) =>
    set({
      properties: Object.fromEntries(properties.map((p) => [p.id, p])),
    }),

  updateProperty: (id, updates) =>
    set((state) => ({
      properties: {
        ...state.properties,
        [id]: { ...state.properties[id], ...updates },
      },
    })),

  toggleFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favorites);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { favorites: next };
    }),

  markSynced: () => set({ lastSyncAt: Date.now() }),
}));

// ─── SELECTORS ────────────────────────────────────────────

let _cachedList: PropertySummary[] = [];
let _cachedProperties: Record<string, Property> = {};

export function selectPropertyList(state: PropertyState): PropertySummary[] {
  if (state.properties === _cachedProperties) return _cachedList;
  _cachedProperties = state.properties;
  _cachedList = Object.values(state.properties).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    neighborhood: p.neighborhood,
    price: p.price,
    priceInReais: p.priceInReais,
    area: p.area,
    suites: p.suites,
    photos: p.photos.slice(0, 3),
    status: p.status,
  }));
  return _cachedList;
}

export function selectFavoriteIds(state: PropertyState): Set<string> {
  return state.favorites;
}

let _cachedSyncStatus: { lastSyncAt: number | null; count: number } | null = null;
let _cachedSyncLastSyncAt: number | null = null;
let _cachedSyncProperties: Record<string, Property> = {};

export function selectSyncStatus(state: PropertyState) {
  if (
    state.lastSyncAt === _cachedSyncLastSyncAt &&
    state.properties === _cachedSyncProperties &&
    _cachedSyncStatus !== null
  ) {
    return _cachedSyncStatus;
  }
  _cachedSyncLastSyncAt = state.lastSyncAt;
  _cachedSyncProperties = state.properties;
  _cachedSyncStatus = {
    lastSyncAt: state.lastSyncAt,
    count: Object.keys(state.properties).length,
  };
  return _cachedSyncStatus;
}
