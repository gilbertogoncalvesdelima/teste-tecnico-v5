// packages/shared/domain/SyncConflictResolver.ts

import type { Property } from "./Property";

export type ConflictStrategy = "LOCAL_WINS" | "SERVER_WINS" | "MERGED";

export interface ConflictResult {
  resolved: Property;
  strategy: ConflictStrategy;
  requiresReview: boolean;
  conflictingFields: string[];
}

const PROPERTY_KEYS: (keyof Property)[] = [
  "id", "slug", "title", "description", "neighborhood", "price", "priceInReais",
  "area", "bedrooms", "suites", "parkingSpots", "status", "notes", "photos",
  "amenities", "updatedAt", "updatedBy",
];

function eq(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
  return a === b;
}

export function getChangedFields(a: Property, b: Property): (keyof Property)[] {
  return PROPERTY_KEYS.filter((key) => !eq(a[key], b[key]));
}

export function resolveConflict(
  local: Property,
  server: Property,
  base: Property
): ConflictResult {
  const localChanged = getChangedFields(base, local);
  const serverChanged = getChangedFields(base, server);
  const allChanged = [...new Set([...localChanged, ...serverChanged])];
  const commonChanged = localChanged.filter((k) => serverChanged.includes(k));

  if (localChanged.includes("price") && serverChanged.includes("price")) {
    return { resolved: server, strategy: "SERVER_WINS", requiresReview: false, conflictingFields: ["price"] };
  }

  if (allChanged.length === 1 && allChanged[0] === "status") {
    return { resolved: server, strategy: "SERVER_WINS", requiresReview: false, conflictingFields: ["status"] };
  }

  const onlyNotesOrPhotos = allChanged.every((k) => k === "notes" || k === "photos");
  if (onlyNotesOrPhotos) {
    return { resolved: local, strategy: "LOCAL_WINS", requiresReview: false, conflictingFields: allChanged };
  }

  const sameFieldConflict = commonChanged.filter((k) => k !== "status" && k !== "price");
  if (sameFieldConflict.length > 0) {
    return {
      resolved: local,
      strategy: "LOCAL_WINS",
      requiresReview: true,
      conflictingFields: sameFieldConflict,
    };
  }

  if (commonChanged.length === 0) {
    const merged = { ...server } as Property;
    for (const key of localChanged) {
      (merged as unknown as Record<string, unknown>)[key] = local[key];
    }
    return { resolved: merged, strategy: "MERGED", requiresReview: false, conflictingFields: [] };
  }

  return { resolved: server, strategy: "SERVER_WINS", requiresReview: false, conflictingFields: commonChanged };
}
