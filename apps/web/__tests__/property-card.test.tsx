// apps/web/__tests__/property-card.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyCard } from "../app/imoveis/components/PropertyCard";
import type { PropertySummary } from "@repo/shared/domain/Property";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const standardProperty: PropertySummary = {
  id: "prop-1",
  slug: "apto-jardins",
  title: "Apartamento Jardins",
  neighborhood: "Jardins",
  price: 850_000_00, // R$850k em centavos
  area: 120,
  suites: 2,
  photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
  status: "available",
};

const luxuryProperty: PropertySummary = {
  id: "prop-2",
  slug: "cobertura-vila-nova",
  title: "Cobertura Vila Nova Conceição",
  neighborhood: "Vila Nova Conceição",
  price: 12_500_000, // R$12.5M em REAIS (não centavos!)
  priceInReais: true,
  area: 450,
  suites: 5,
  photos: ["https://example.com/luxury1.jpg"],
  status: "available",
};

const emptyPhotosProperty: PropertySummary = {
  ...standardProperty,
  id: "prop-3",
  slug: "sem-fotos",
  photos: [],
};

describe("PropertyCard", () => {
  // ✅ PASSA
  it("renderiza título e bairro", () => {
    render(<PropertyCard property={standardProperty} />);
    expect(screen.getByText("Apartamento Jardins")).toBeDefined();
    expect(screen.getByText("Jardins")).toBeDefined();
  });

  // ✅ PASSA
  it("renderiza área e suítes formatados", () => {
    render(<PropertyCard property={standardProperty} />);
    expect(screen.getByText("120 m²")).toBeDefined();
    expect(screen.getByText("2 suítes")).toBeDefined();
  });

  // ❌ FALHA — preço de luxo é formatado errado (trata reais como centavos)
  it("formata preço corretamente para imóvel de luxo", () => {
    render(<PropertyCard property={luxuryProperty} />);
    // R$12.500.000,00 — não R$125.000,00 (que é o que sai se tratar reais como centavos)
    expect(screen.getByText("R$ 12.500.000,00")).toBeDefined();
  });

  // ❌ FALHA — crash quando photos está vazio
  it("renderiza placeholder quando não há fotos", () => {
    // Não deveria crashar
    expect(() => {
      render(<PropertyCard property={emptyPhotosProperty} />);
    }).not.toThrow();

    // Deveria mostrar algum placeholder
    const img = screen.queryByRole("img");
    if (img) {
      expect(img.getAttribute("src")).not.toBe("undefined");
    }
  });

  // ❌ FALHA — click no favoritar também navega
  it("click em favoritar não propaga para o link", () => {
    const onFavorite = vi.fn();
    const { container } = render(
      <PropertyCard property={standardProperty} onFavorite={onFavorite} />
    );

    const link = container.querySelector("a")!;
    const linkClick = vi.fn();
    link.addEventListener("click", linkClick);

    const button = screen.getByText("♡ Favoritar");
    fireEvent.click(button);

    expect(onFavorite).toHaveBeenCalledWith("prop-1");
    // O click NÃO deveria ter propagado para o link
    expect(linkClick).not.toHaveBeenCalled();
  });

  // ❌ FALHA — preço padrão (centavos) deve funcionar também
  it("formata preço corretamente para imóvel padrão", () => {
    render(<PropertyCard property={standardProperty} />);
    expect(screen.getByText("R$ 850.000,00")).toBeDefined();
  });
});
