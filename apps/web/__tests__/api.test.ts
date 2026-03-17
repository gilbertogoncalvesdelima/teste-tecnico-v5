// apps/web/__tests__/api.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProperties, fetchPropertyBySlug } from "../lib/api";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchProperties", () => {
  it("chama endpoint correto sem filtros", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchProperties();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/properties?")
    );
  });

  it("passa filtro de suítes corretamente", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchProperties({ suitesMin: 3 });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("suites_min=3");
  });

  it("passa múltiplos bairros como lista separada por vírgula", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchProperties({ neighborhoods: ["Jardins", "Itaim"] });

    const url = mockFetch.mock.calls[0][0] as string;
    // A API espera neighborhood=Jardins,Itaim (um único param)
    // NÃO neighborhood=Jardins&neighborhood=Itaim (múltiplos params)
    expect(url).toContain("neighborhood=Jardins%2CItaim");
  });

  // ❌ FALHA — fetchProperties não verifica res.ok
  it("lança erro quando API retorna 500", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Internal Server Error" }),
    });

    await expect(fetchProperties()).rejects.toThrow();
  });
});

describe("fetchPropertyBySlug", () => {
  it("retorna null para 404", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchPropertyBySlug("nao-existe");
    expect(result).toBeNull();
  });

  it("retorna property para slug válido", async () => {
    const mockProperty = { id: "1", slug: "casa-jardins", title: "Casa" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProperty),
    });

    const result = await fetchPropertyBySlug("casa-jardins");
    expect(result).toEqual(mockProperty);
  });

  // ❌ FALHA — depende de fetchProperties tratar neighborhood como join
  it("filtra bairros corretamente quando vindo de searchParams", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    // Simula o que o SearchFilters faria com múltiplos bairros
    await fetchProperties({
      neighborhoods: ["Vila Nova Conceição", "Moema", "Brooklin"],
    });

    const url = mockFetch.mock.calls[0][0] as string;
    const params = new URL(url).searchParams;

    // Deve ter UM param com valores separados por vírgula
    expect(params.getAll("neighborhood")).toHaveLength(1);
    expect(params.get("neighborhood")).toBe(
      "Vila Nova Conceição,Moema,Brooklin"
    );
  });
});
