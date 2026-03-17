// apps/mobile/__tests__/property-store.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { usePropertyStore, selectPropertyList, selectFavoriteIds, selectSyncStatus } from "../src/stores/propertyStore";
import type { Property } from "@repo/shared/domain/Property";

function makeProperty(id: string, overrides: Partial<Property> = {}): Property {
  return {
    id,
    slug: `imovel-${id}`,
    title: `Imóvel ${id}`,
    description: "Descrição",
    neighborhood: "Jardins",
    price: 500_000_00,
    area: 100,
    bedrooms: 3,
    suites: 2,
    parkingSpots: 1,
    status: "available",
    notes: [],
    photos: ["photo1.jpg", "photo2.jpg"],
    amenities: [],
    updatedAt: Date.now(),
    updatedBy: "backoffice",
    ...overrides,
  };
}

beforeEach(() => {
  // Reset store entre testes
  usePropertyStore.setState({
    properties: {},
    favorites: new Set(),
    lastSyncAt: null,
  });
});

describe("propertyStore actions", () => {
  // ✅ PASSA
  it("setProperties popula o store corretamente", () => {
    const props = [makeProperty("1"), makeProperty("2")];
    usePropertyStore.getState().setProperties(props);

    const state = usePropertyStore.getState();
    expect(Object.keys(state.properties)).toHaveLength(2);
    expect(state.properties["1"].title).toBe("Imóvel 1");
  });

  // ✅ PASSA
  it("toggleFavorite adiciona e remove", () => {
    usePropertyStore.getState().toggleFavorite("1");
    expect(usePropertyStore.getState().favorites.has("1")).toBe(true);

    usePropertyStore.getState().toggleFavorite("1");
    expect(usePropertyStore.getState().favorites.has("1")).toBe(false);
  });
});

describe("selectors — referential stability", () => {
  // ❌ FALHA — selectPropertyList retorna novo array a cada chamada
  it("selectPropertyList retorna mesma referência quando properties não mudaram", () => {
    const props = [makeProperty("1"), makeProperty("2")];
    usePropertyStore.getState().setProperties(props);

    const state = usePropertyStore.getState();
    const list1 = selectPropertyList(state);
    const list2 = selectPropertyList(state);

    // Deveria ser a mesma referência (memoizado)
    expect(list1).toBe(list2);
  });

  // ❌ FALHA — selectFavoriteIds retorna novo Set a cada chamada
  it("selectFavoriteIds retorna mesma referência quando favorites não mudaram", () => {
    usePropertyStore.getState().toggleFavorite("1");

    const state = usePropertyStore.getState();
    const ids1 = selectFavoriteIds(state);
    const ids2 = selectFavoriteIds(state);

    expect(ids1).toBe(ids2);
  });

  // ❌ FALHA — selectSyncStatus cria novo objeto a cada chamada
  it("selectSyncStatus retorna mesma referência quando dados não mudaram", () => {
    usePropertyStore.getState().markSynced();

    const state = usePropertyStore.getState();
    const status1 = selectSyncStatus(state);
    const status2 = selectSyncStatus(state);

    expect(status1).toBe(status2);
  });
});
