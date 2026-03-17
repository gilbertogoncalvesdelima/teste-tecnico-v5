// apps/web/__tests__/price-calculator.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PriceCalculator } from "../app/imoveis/[slug]/components/PriceCalculator";
import type { Property } from "@repo/shared/domain/Property";

function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: "1",
    slug: "test",
    title: "Test",
    description: "Desc",
    neighborhood: "Jardins",
    price: 1_000_000_00, // R$1M em centavos
    area: 200,
    bedrooms: 4,
    suites: 2,
    parkingSpots: 2,
    status: "available",
    notes: [],
    photos: [],
    amenities: [],
    updatedAt: Date.now(),
    updatedBy: "backoffice",
    ...overrides,
  };
}

describe("PriceCalculator", () => {
  // ✅ PASSA — imóvel padrão (preço em centavos)
  it("renderiza valores para imóvel padrão", () => {
    const prop = makeProperty({ price: 800_000_00 }); // R$800k
    render(<PriceCalculator property={prop} />);
    expect(screen.getByText("R$ 800.000,00")).toBeDefined();
  });

  // ✅ PASSA — ITBI padrão
  it("calcula ITBI 3% para imóvel padrão", () => {
    const prop = makeProperty({ price: 1_000_000_00 }); // R$1M
    render(<PriceCalculator property={prop} />);
    // ITBI: 3% de R$1M = R$30.000
    expect(screen.getByText("R$ 30.000,00")).toBeDefined();
  });

  // ✅ PASSA — registro na faixa certa
  it("mostra taxa de registro correta (faixa até 1M)", () => {
    const prop = makeProperty({ price: 800_000_00 }); // R$800k
    render(<PriceCalculator property={prop} />);
    expect(screen.getByText("R$ 3.500,00")).toBeDefined();
  });

  // ❌ FALHA — imóvel de luxo com preço em reais
  it("calcula valores corretamente para imóvel de LUXO", () => {
    const prop = makeProperty({
      price: 7_500_000,
      priceInReais: true,
    });
    render(<PriceCalculator property={prop} />);

    // Valor do imóvel: R$7.500.000,00
    expect(screen.getByText("R$ 7.500.000,00")).toBeDefined();
    // ITBI: R$225.000,00
    expect(screen.getByText("R$ 225.000,00")).toBeDefined();
    // Registro: R$15.000,00 (faixa > 5M)
    expect(screen.getByText("R$ 15.000,00")).toBeDefined();
  });

  // ❌ FALHA — total de luxo
  it("calcula total correto para luxo", () => {
    const prop = makeProperty({
      price: 7_500_000,
      priceInReais: true,
    });
    render(<PriceCalculator property={prop} />);

    // Total: R$7.500.000 + R$225.000 + R$15.000 = R$7.740.000,00
    expect(screen.getByText("R$ 7.740.000,00")).toBeDefined();
  });

  // ❌ FALHA — entrada de luxo
  it("calcula entrada de 20% correta para luxo", () => {
    const prop = makeProperty({
      price: 10_000_000,
      priceInReais: true,
    });
    render(<PriceCalculator property={prop} />);

    // Entrada 20% de R$10M = R$2.000.000,00
    expect(screen.getByText("R$ 2.000.000,00")).toBeDefined();
  });

  // ❌ FALHA — parcela de luxo precisa fazer sentido
  it("calcula parcela mensal plausível para luxo", () => {
    const prop = makeProperty({
      price: 10_000_000,
      priceInReais: true,
    });
    render(<PriceCalculator property={prop} />);

    // Parcela de R$8M financiados em 30 anos a 9.99%
    // Deve estar entre R$60.000 e R$75.000 (approximação tabela Price)
    const allText = document.body.textContent ?? "";

    // Verifica que o valor da parcela não é absurdo
    // Se o bug existir, a parcela será centavos (ex: R$643,21) em vez de milhares
    const monthlyMatch = allText.match(/Parcela mensal estimada.*?(R\$ [\d.,]+)/);
    if (monthlyMatch) {
      const value = parseFloat(
        monthlyMatch[1].replace("R$ ", "").replace(/\./g, "").replace(",", ".")
      );
      expect(value).toBeGreaterThan(50_000);
      expect(value).toBeLessThan(80_000);
    }
  });

  // ❌ FALHA — slider de entrada deve funcionar
  it("atualiza parcela quando entrada muda", () => {
    const prop = makeProperty({ price: 1_000_000_00 }); // R$1M padrão
    render(<PriceCalculator property={prop} />);

    // Muda entrada para 50%
    const slider = screen.getByLabelText(/Entrada/);
    fireEvent.change(slider, { target: { value: "50" } });

    // Deve mostrar "Entrada: 50%" no label
    expect(screen.getByText(/Entrada:\s*50\s*%/)).toBeDefined();
  });
});
