import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchFilters } from "../app/imoveis/components/SearchFilters";
import type { PropertySummary } from "@repo/shared/domain/Property";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
let searchParamsString = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(searchParamsString),
}));

beforeEach(() => {
  mockPush.mockClear();
  mockRefresh.mockClear();
  searchParamsString = "";
});

const propsWithJardins: PropertySummary[] = [
  { id: "1", slug: "j", title: "J", neighborhood: "Jardins", price: 100, area: 80, suites: 1, photos: [], status: "available" },
];
const propsWithJardinsAndMoema: PropertySummary[] = [
  { id: "1", slug: "j", title: "J", neighborhood: "Jardins", price: 100, area: 80, suites: 1, photos: [], status: "available" },
  { id: "2", slug: "m", title: "M", neighborhood: "Moema", price: 200, area: 90, suites: 2, photos: [], status: "available" },
];

function renderWithParams(params: string, properties: PropertySummary[] = []) {
  searchParamsString = params;
  return render(<SearchFilters properties={properties} />);
}

describe("SearchFilters", () => {
  it("aplica filtro de bairro nos searchParams", () => {
    renderWithParams("", propsWithJardins);
    const jardinsCheckbox = screen.getByTestId("filter-neighborhood-Jardins");
    expect(jardinsCheckbox).toBeDefined();
    fireEvent.click(jardinsCheckbox as HTMLInputElement);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("neighborhood=Jardins"));
  });

  it("mostra erro quando preço mínimo > máximo", () => {
    renderWithParams("price_min=500000&price_max=100000");
    expect(screen.getByTestId("price-validation-error")).toBeTruthy();
    expect(screen.getByText("Preço mínimo não pode ser maior que o máximo")).toBeTruthy();
  });

  it("limpar filtros reseta URL", () => {
    renderWithParams("neighborhood=Jardins&price_min=100000");
    const clearBtn = screen.getByTestId("filter-clear");
    fireEvent.click(clearBtn);
    expect(mockPush).toHaveBeenCalledWith("/imoveis");
  });

  it("restaura filtros a partir da URL", () => {
    renderWithParams("neighborhood=Jardins&price_min=100000&suites_min=2&area_min=80", propsWithJardins);
    const jardinsCheckbox = screen.getByTestId("filter-neighborhood-Jardins") as HTMLInputElement;
    expect(jardinsCheckbox.checked).toBe(true);
    expect((screen.getByTestId("filter-price-min") as HTMLInputElement).value).toBe("100.000");
    expect((screen.getByTestId("filter-suites-2") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByTestId("filter-area-80") as HTMLInputElement).checked).toBe(true);
  });

  it("multiple neighborhoods in URL are all reflected in checkboxes (edge case: URL is source of truth for multi-select)", () => {
    renderWithParams("neighborhood=Jardins%2CMoema", propsWithJardinsAndMoema);
    const jardinsCheckbox = screen.getByTestId("filter-neighborhood-Jardins") as HTMLInputElement;
    const moemaCheckbox = screen.getByTestId("filter-neighborhood-Moema") as HTMLInputElement;
    expect(jardinsCheckbox.checked).toBe(true);
    expect(moemaCheckbox.checked).toBe(true);
  });
});
