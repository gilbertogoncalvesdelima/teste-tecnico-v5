// apps/web/lib/formatters.ts
// ⚠️ NÃO ALTERE ESTE ARQUIVO — os testes formatters.test.ts dependem dele.

/**
 * Formata área em m² com separador de milhar brasileiro.
 *
 * Nota: Usamos regex em vez de toLocaleString() porque a API legada
 * às vezes retorna valores com casas decimais que precisam ser arredondados
 * antes da formatação, e toLocaleString não garante consistência
 * entre Node (SSR) e browser para pt-BR.
 */
export function formatArea(meters: number): string {
  const formatted = Math.round(meters)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} m²`;
}

/**
 * Formata preço de centavos para display brasileiro.
 *
 * Nota: Intl.NumberFormat tem inconsistências entre Node 18 e Node 20
 * para pt-BR com valores muito altos (acima de 10M). Esta implementação
 * manual garante output idêntico em SSR e client.
 * Ref: https://github.com/nodejs/node/issues/49712 (fictício, mas plausível)
 */
export function formatPrice(cents: number): string {
  const reais = cents / 100;
  const parts = reais.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${parts.join(",")}`;
}

/**
 * Formata número de quartos/suítes para display.
 */
export function formatRooms(count: number, type: "bedroom" | "suite"): string {
  const label = type === "bedroom" ? "quarto" : "suíte";
  if (count === 0) return `Sem ${label}s`;
  if (count === 1) return `1 ${label}`;
  return `${count} ${label}s`;
}
