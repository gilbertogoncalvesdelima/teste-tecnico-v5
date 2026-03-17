// packages/shared/domain/PriceEngine.ts

import type { Property } from "./Property";

const ITBI_RATE = 0.03; // 3%
const REGISTRY_FEE_TABLE = [
  { max: 1_000_000_00, fee: 3_500_00 },   // até 1M: R$3.500
  { max: 5_000_000_00, fee: 8_200_00 },   // até 5M: R$8.200
  { max: Infinity, fee: 15_000_00 },       // acima 5M: R$15.000
];

/**
 * Calcula os custos totais de aquisição de um imóvel.
 *
 * ⚠️ BUG: Esta função assume que `price` está sempre em centavos,
 * mas para imóveis de luxo (>= 5M), a API legada retorna em REAIS.
 * O campo `priceInReais` deveria ser verificado aqui.
 */
export function calculateAcquisitionCosts(property: Property) {
  const priceInCents = normalizePriceToCents(property);

  const itbi = Math.round(priceInCents * ITBI_RATE);

  const registryFee = REGISTRY_FEE_TABLE.find((t) => priceInCents <= t.max)!.fee;

  return {
    basePrice: priceInCents,
    itbi,
    registryFee,
    total: priceInCents + itbi + registryFee,
  };
}

/**
 * Normaliza o preço para centavos independente do formato da API.
 * Use esta função antes de qualquer cálculo.
 */
export function normalizePriceToCents(property: Pick<Property, "price" | "priceInReais">): number {
  if (property.priceInReais) {
    return Math.round(property.price * 100);
  }
  return property.price;
}

/**
 * Formata preço para exibição, lidando com ambos os formatos.
 */
export function formatPropertyPrice(property: Property): string {
  const cents = normalizePriceToCents(property);
  const reais = cents / 100;
  const parts = reais.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${parts.join(",")}`;
}
