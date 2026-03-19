// apps/web/__tests__/gallery.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GalleryClient } from "../app/imoveis/[slug]/components/GalleryClient";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} data-testid="gallery-img" />,
}));

// Mock window.Image para evitar side effects
beforeEach(() => {
  vi.stubGlobal("Image", class {
    onload: (() => void) | null = null;
    set src(_: string) {
      setTimeout(() => this.onload?.(), 0);
    }
  });
});

const mockPhotos = [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg",
  "https://example.com/photo4.jpg",
];

describe("GalleryClient", () => {
  // ✅ PASSA
  it("renderiza a primeira foto e counter", () => {
    render(<GalleryClient photos={mockPhotos} title="Casa" />);
    expect(screen.getByRole("tablist", { name: "Posição das fotos" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Foto 1", selected: true })).toBeDefined();
  });

  // ❌ FALHA — crash quando photos está vazio
  it("renderiza placeholder quando photos está vazio", () => {
    expect(() => {
      render(<GalleryClient photos={[]} title="Sem fotos" />);
    }).not.toThrow();

    // Deve mostrar mensagem ou placeholder, não crashar
    expect(screen.queryByText("0 / 0")).toBeNull(); // Não deve mostrar "0 / 0"
  });

  // ❌ FALHA — goNext não faz wrap-around, vai para index inválido
  it("navega para próxima foto com wrap-around", () => {
    render(<GalleryClient photos={mockPhotos} title="Casa" />);

    const nextBtn = screen.getByLabelText("Próxima foto");
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    expect(screen.getByRole("tab", { name: "Foto 4", selected: true })).toBeDefined();

    fireEvent.click(nextBtn);
    expect(screen.getByRole("tab", { name: "Foto 1", selected: true })).toBeDefined();
  });

  // ❌ FALHA — goPrev vai para -1
  it("navega para foto anterior com wrap-around", () => {
    render(<GalleryClient photos={mockPhotos} title="Casa" />);

    const prevBtn = screen.getByLabelText("Foto anterior");
    fireEvent.click(prevBtn);
    expect(screen.getByRole("tab", { name: "Foto 4", selected: true })).toBeDefined();
  });
});
