// apps/mobile/__tests__/property-list-item.test.tsx

import { describe, it, expect, vi } from "vitest";

describe("PropertyListItem", () => {
  // ✅ PASSA — exporta um componente
  it("exporta o componente PropertyListItem", async () => {
    const mod = await import("../src/components/PropertyListItem");
    expect(mod.PropertyListItem).toBeDefined();
    // React.memo components are exotic objects in React 19
    const comp = mod.PropertyListItem;
    expect(typeof comp === "function" || (comp as any).$$typeof !== undefined).toBe(true);
  });

  // ❌ FALHA — componente não está envolto em React.memo
  it("é envolto em React.memo para evitar re-renders desnecessários", async () => {
    const mod = await import("../src/components/PropertyListItem");
    const component = mod.PropertyListItem;

    // React.memo components têm $$typeof de Symbol(react.memo) ou
    // propriedade .type indicando que é memoizado
    // Verificamos de forma pragmática: o displayName ou toString indica memo
    const str = Object.prototype.toString.call(component);
    const isMemo =
      component.$$typeof?.toString() === "Symbol(react.memo)" ||
      (component as any).type !== undefined ||
      String(component).includes("memo");

    expect(isMemo).toBe(true);
  });

  // ❌ FALHA — inline styles fora do StyleSheet
  it("não usa objetos de style inline (deve usar StyleSheet)", async () => {
    // Lê o source code do arquivo para verificar uso de StyleSheet
    const path = await import("path");
    const fs = await import("fs");
    const filePath = path.resolve(
      __dirname,
      "../src/components/PropertyListItem.tsx"
    );
    const source = fs.readFileSync(filePath, "utf-8");

    // Conta quantos style={{ aparecem no JSX (excluindo o styles.xxx)
    // O componente atual tem ~5 inline styles; deveria ter 0
    const inlineStyles = (source.match(/style=\{\{/g) ?? []).length;

    // Permite no máximo 1 inline style (para o borderColor dinâmico)
    expect(inlineStyles).toBeLessThanOrEqual(1);
  });
});
