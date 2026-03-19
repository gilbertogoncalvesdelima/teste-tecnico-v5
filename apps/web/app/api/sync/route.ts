import { NextRequest, NextResponse } from "next/server";
import { mockProperties } from "@/app/api/properties/mockData";
import type { Property } from "@repo/shared/domain/Property";

export async function POST(request: NextRequest) {
  const simulate = request.nextUrl.searchParams.get("simulate") ?? "success";
  let body: { type?: string; entityId?: string; payload?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const entityId = String(body.entityId ?? "1");
  const prop = mockProperties.find((p) => p.id === entityId);
  const base: Property = prop
    ? { ...prop }
    : ({
        id: entityId,
        slug: "demo",
        title: "Demo",
        description: "",
        neighborhood: "Jardins",
        price: 500_000_00,
        area: 100,
        bedrooms: 2,
        suites: 1,
        parkingSpots: 1,
        status: "available",
        notes: [],
        photos: [],
        amenities: [],
        updatedAt: Date.now(),
        updatedBy: "backoffice",
      } as Property);

  if (simulate === "fail") {
    return NextResponse.json({ success: false, error: "Simulated failure" }, { status: 500 });
  }

  if (simulate === "conflict") {
    const serverVersion: Property = {
      ...base,
      status: "reserved",
      updatedAt: Date.now(),
      updatedBy: "backoffice",
    };
    if (base.notes?.length === 0) serverVersion.notes = ["Nota do servidor"];
    return NextResponse.json({ success: false, serverVersion });
  }

  return NextResponse.json({ success: true });
}
