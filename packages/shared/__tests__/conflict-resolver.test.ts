// packages/shared/__tests__/conflict-resolver.test.ts

import { describe, it, expect } from "vitest";
import { resolveConflict, getChangedFields } from "../domain/SyncConflictResolver";
import type { Property } from "../domain/Property";

function makeProperty(id: string, overrides: Partial<Property> = {}): Property {
  return {
    id,
    slug: `imovel-${id}`,
    title: `Imóvel ${id}`,
    description: "Descrição",
    neighborhood: "Jardins",
    price: 500_000_00,
    area: 100,
    bedrooms: 3,
    suites: 2,
    parkingSpots: 1,
    status: "available",
    notes: [],
    photos: ["photo1.jpg"],
    amenities: [],
    updatedAt: 1000,
    updatedBy: "backoffice",
    ...overrides,
  };
}

describe("SyncConflictResolver", () => {
  it("only status changed → SERVER_WINS", () => {
    const base = makeProperty("1", { status: "available" });
    const local = makeProperty("1", { status: "available" });
    const server = makeProperty("1", { status: "reserved" });
    const result = resolveConflict(local, server, base);
    expect(result.strategy).toBe("SERVER_WINS");
    expect(result.resolved.status).toBe("reserved");
    expect(result.requiresReview).toBe(false);
  });

  it("only notes or photos changed → LOCAL_WINS", () => {
    const base = makeProperty("1", { notes: [], photos: ["a.jpg"] });
    const local = makeProperty("1", { notes: ["Visita feita"], photos: ["a.jpg"] });
    const server = makeProperty("1", { notes: [], photos: ["a.jpg", "b.jpg"] });
    const result = resolveConflict(local, server, base);
    expect(result.strategy).toBe("LOCAL_WINS");
    expect(result.resolved.notes).toEqual(["Visita feita"]);
    expect(result.requiresReview).toBe(false);
  });

  it("price changed on both sides → SERVER_WINS", () => {
    const base = makeProperty("1", { price: 400_000_00 });
    const local = makeProperty("1", { price: 450_000_00 });
    const server = makeProperty("1", { price: 420_000_00 });
    const result = resolveConflict(local, server, base);
    expect(result.strategy).toBe("SERVER_WINS");
    expect(result.resolved.price).toBe(420_000_00);
  });

  it("different fields changed on each side → MERGED", () => {
    const base = makeProperty("1", { title: "Antigo", description: "Antiga" });
    const local = makeProperty("1", { title: "Título Local", description: "Antiga" });
    const server = makeProperty("1", { title: "Antigo", description: "Desc Server" });
    const result = resolveConflict(local, server, base);
    expect(result.strategy).toBe("MERGED");
    expect(result.resolved.title).toBe("Título Local");
    expect(result.resolved.description).toBe("Desc Server");
    expect(result.requiresReview).toBe(false);
  });

  it("same field (not status/price) changed on both → LOCAL_WINS + requiresReview", () => {
    const base = makeProperty("1", { title: "Antigo" });
    const local = makeProperty("1", { title: "Título Local" });
    const server = makeProperty("1", { title: "Título Server" });
    const result = resolveConflict(local, server, base);
    expect(result.strategy).toBe("LOCAL_WINS");
    expect(result.requiresReview).toBe(true);
    expect(result.resolved.title).toBe("Título Local");
    expect(result.conflictingFields).toContain("title");
  });
});

describe("getChangedFields", () => {
  it("returns empty when objects are equal", () => {
    const a = makeProperty("1");
    const b = makeProperty("1");
    expect(getChangedFields(a, b)).toEqual([]);
  });

  it("returns array of differing field names", () => {
    const a = makeProperty("1", { title: "A", status: "available" });
    const b = makeProperty("1", { title: "B", status: "reserved" });
    const fields = getChangedFields(a, b);
    expect(fields).toContain("title");
    expect(fields).toContain("status");
    expect(fields).toHaveLength(2);
  });
});
