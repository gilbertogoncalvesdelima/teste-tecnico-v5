// packages/shared/__tests__/price-engine.test.ts

import { describe, it, expect } from "vitest";
import {
  calculateAcquisitionCosts,
  normalizePriceToCents,
  formatPropertyPrice,
} from "../domain/PriceEngine";
import type { Property } from "../domain/Property";

function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: "prop-1",
    slug: "casa-jardins",
    title: "Casa Jardins",
    description: "Linda casa",
    neighborhood: "Jardins",
    price: 500_000_00, // 500k em centavos
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

describe("normalizePriceToCents", () => {
  it("retorna preço como está quando já é centavos", () => {
    const prop = makeProperty({ price: 500_000_00 });
    expect(normalizePriceToCents(prop)).toBe(500_000_00);
  });

  it("converte reais para centavos quando priceInReais=true", () => {
    const prop = makeProperty({ price: 7_500_000, priceInReais: true });
    expect(normalizePriceToCents(prop)).toBe(750_000_000);
  });

  it("lida com valores fracionários em reais", () => {
    const prop = makeProperty({ price: 5_250_000.5, priceInReais: true });
    expect(normalizePriceToCents(prop)).toBe(525_000_050);
  });
});

describe("calculateAcquisitionCosts", () => {
  it("calcula ITBI corretamente para imóvel padrão (centavos)", () => {
    const prop = makeProperty({ price: 800_000_00 }); // R$800k
    const costs = calculateAcquisitionCosts(prop);
    expect(costs.itbi).toBe(24_000_00); // 3% de 800k
    expect(costs.registryFee).toBe(3_500_00);
    expect(costs.total).toBe(800_000_00 + 24_000_00 + 3_500_00);
  });

  it("usa taxa de registro correta para faixa 1-5M", () => {
    const prop = makeProperty({ price: 3_000_000_00 }); // R$3M
    const costs = calculateAcquisitionCosts(prop);
    expect(costs.registryFee).toBe(8_200_00);
  });

  // ❌ ESTE TESTE FALHA — o bug está aqui
  it("calcula ITBI corretamente para imóvel de LUXO (preço em reais)", () => {
    // Imóvel de 7.5M — API legada retorna em REAIS, não centavos
    const prop = makeProperty({
      price: 7_500_000,
      priceInReais: true,
    });

    const costs = calculateAcquisitionCosts(prop);

    // ITBI deveria ser 3% de R$7.5M = R$225.000 = 22_500_000 centavos
    expect(costs.itbi).toBe(22_500_000);
    expect(costs.registryFee).toBe(15_000_00); // faixa > 5M
    expect(costs.total).toBe(750_000_000 + 22_500_000 + 15_000_00);
  });

  // ❌ ESTE TESTE FALHA — consequência do mesmo bug
  it("taxa de registro usa faixa correta para luxo", () => {
    const prop = makeProperty({
      price: 6_000_000,
      priceInReais: true,
    });

    const costs = calculateAcquisitionCosts(prop);
    // R$6M em centavos = 600_000_000 → faixa > 5M → R$15.000
    expect(costs.registryFee).toBe(15_000_00);
  });
});

describe("formatPropertyPrice", () => {
  it("formata preço padrão (centavos)", () => {
    const prop = makeProperty({ price: 1_250_000_00 });
    expect(formatPropertyPrice(prop)).toBe("R$ 1.250.000,00");
  });

  it("formata preço de luxo (reais)", () => {
    const prop = makeProperty({ price: 7_500_000, priceInReais: true });
    expect(formatPropertyPrice(prop)).toBe("R$ 7.500.000,00");
  });
});
