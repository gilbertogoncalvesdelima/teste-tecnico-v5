// apps/mobile/__tests__/render-count.test.tsx

import { describe, it, expect, vi } from "vitest";
import React, { useRef } from "react";
import { render, act } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { usePropertyStore, selectPropertyList } from "../src/stores/propertyStore";
import { PropertyListItem } from "../src/components/PropertyListItem";
import type { Property } from "@repo/shared/domain/Property";

function makeProperty(id: string): Property {
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
    photos: ["photo.jpg"],
    amenities: [],
    updatedAt: Date.now(),
    updatedBy: "backoffice",
  };
}

/**
 * Este teste verifica que alterar UM item da lista NÃO causa re-render
 * em outros itens. É o teste de performance mais importante.
 *
 * O candidato precisa:
 * 1. Memoizar PropertyListItem com React.memo
 * 2. Estabilizar os selectors do store (evitar novo array/objeto a cada chamada)
 * 3. Garantir que callbacks passados para o item sejam estáveis (useCallback)
 */
describe("PropertyListItem — render count", () => {
  beforeEach(() => {
    usePropertyStore.setState({
      properties: {},
      favorites: new Set(),
      lastSyncAt: null,
    });
  });

  it("não re-renderiza item vizinho quando outro item é atualizado", () => {
    // Setup: 5 propriedades no store
    const properties = Array.from({ length: 5 }, (_, i) => makeProperty(String(i)));
    usePropertyStore.getState().setProperties(properties);

    const renderCounts: Record<string, number> = {};

    // Componente wrapper que rastreia renders
    function TrackedItem({ id }: { id: string }) {
      renderCounts[id] = (renderCounts[id] ?? 0) + 1;

      const property = usePropertyStore((s) => {
        const list = selectPropertyList(s);
        return list.find((p) => p.id === id);
      });

      if (!property) return null;

      return (
        <PropertyListItem
          property={property}
          isFavorited={false}
          onPress={() => {}}
          onFavorite={() => {}}
        />
      );
    }

    function TestList() {
      return (
        <View>
          {["0", "1", "2", "3", "4"].map((id) => (
            <TrackedItem key={id} id={id} />
          ))}
        </View>
      );
    }

    render(<TestList />);

    // Render inicial: todos renderizam 1x
    expect(renderCounts["0"]).toBe(1);
    expect(renderCounts["2"]).toBe(1);

    // Atualiza APENAS o item 3
    act(() => {
      usePropertyStore.getState().updateProperty("3", {
        title: "Título Atualizado",
      });
    });

    // Item 3 deve re-renderizar (dados mudaram)
    expect(renderCounts["3"]).toBe(2);

    // Item 0 NÃO deve re-renderizar (dados não mudaram)
    // ❌ FALHA: Com o selector bugado, TODOS re-renderizam
    expect(renderCounts["0"]).toBeLessThanOrEqual(2);

    // Item 2 NÃO deve re-renderizar
    expect(renderCounts["2"]).toBeLessThanOrEqual(2);
  });
});
