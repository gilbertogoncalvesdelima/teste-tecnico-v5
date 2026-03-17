// apps/web/__tests__/formatters.test.ts
// ✅ Todos esses testes PASSAM. Se quebrarem, o candidato mexeu no formatters.ts.

import { describe, it, expect } from "vitest";
import { formatArea, formatPrice, formatRooms } from "../lib/formatters";

describe("formatArea", () => {
  it("formata área com separador de milhar", () => {
    expect(formatArea(1500)).toBe("1.500 m²");
  });

  it("arredonda valores decimais", () => {
    expect(formatArea(1234.7)).toBe("1.235 m²");
  });
});

describe("formatPrice", () => {
  it("formata centavos para real brasileiro", () => {
    // R$1.250.000,00
    expect(formatPrice(1_250_000_00)).toBe("R$ 1.250.000,00");
  });

  it("formata valores altos corretamente (acima de 10M)", () => {
    // R$12.500.000,00 — este é o caso que Intl quebra no Node 18
    expect(formatPrice(12_500_000_00)).toBe("R$ 12.500.000,00");
  });

  it("formata zero", () => {
    expect(formatPrice(0)).toBe("R$ 0,00");
  });
});

describe("formatRooms", () => {
  it("pluraliza corretamente", () => {
    expect(formatRooms(0, "suite")).toBe("Sem suítes");
    expect(formatRooms(1, "suite")).toBe("1 suíte");
    expect(formatRooms(3, "suite")).toBe("3 suítes");
    expect(formatRooms(1, "bedroom")).toBe("1 quarto");
    expect(formatRooms(4, "bedroom")).toBe("4 quartos");
  });
});
