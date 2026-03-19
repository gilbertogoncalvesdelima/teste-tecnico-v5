import { NextRequest } from "next/server";
import { getMockSummaries } from "./mockData";

export async function GET(request: NextRequest) {
  const summaries = getMockSummaries();
  const { searchParams } = new URL(request.url);

  let filtered = summaries;

  const neighborhood = searchParams.get("neighborhood");
  if (neighborhood) {
    const neighborhoods = neighborhood.split(",").map((n) => n.trim());
    filtered = filtered.filter((p) =>
      neighborhoods.some((n) => p.neighborhood.toLowerCase() === n.toLowerCase())
    );
  }

  const priceMin = searchParams.get("price_min");
  if (priceMin) {
    const min = Number(priceMin);
    if (!Number.isNaN(min)) {
      filtered = filtered.filter((p) => (p.priceInReais ? p.price : p.price / 100) >= min);
    }
  }

  const priceMax = searchParams.get("price_max");
  if (priceMax) {
    const max = Number(priceMax);
    if (!Number.isNaN(max)) {
      filtered = filtered.filter((p) => (p.priceInReais ? p.price : p.price / 100) <= max);
    }
  }

  const suitesMin = searchParams.get("suites_min");
  if (suitesMin) {
    const min = Number(suitesMin);
    if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.suites >= min);
  }

  const areaMin = searchParams.get("area_min");
  if (areaMin) {
    const min = Number(areaMin);
    if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.area >= min);
  }

  return Response.json(filtered);
}
