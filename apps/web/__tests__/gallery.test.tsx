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
    expect(screen.getByText("1 / 4")).toBeDefined();
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

    // Vai até a última foto
    const nextBtn = screen.getByLabelText("Próxima foto");
    fireEvent.click(nextBtn); // 2/4
    fireEvent.click(nextBtn); // 3/4
    fireEvent.click(nextBtn); // 4/4

    expect(screen.getByText("4 / 4")).toBeDefined();

    // Próximo click deve voltar para 1/4 (wrap-around)
    fireEvent.click(nextBtn);
    expect(screen.getByText("1 / 4")).toBeDefined();
  });

  // ❌ FALHA — goPrev vai para -1
  it("navega para foto anterior com wrap-around", () => {
    render(<GalleryClient photos={mockPhotos} title="Casa" />);

    // Estamos em 1/4, ir para anterior deve ir para 4/4
    const prevBtn = screen.getByLabelText("Foto anterior");
    fireEvent.click(prevBtn);
    expect(screen.getByText("4 / 4")).toBeDefined();
  });
});
