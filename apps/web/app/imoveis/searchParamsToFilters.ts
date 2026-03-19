export function searchParamsToFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): {
  neighborhoods?: string[];
  priceMin?: number;
  priceMax?: number;
  suitesMin?: number;
  areaMin?: number;
} {
  const neighborhood = searchParams.neighborhood;
  const neighborhoods =
    typeof neighborhood === "string" && neighborhood
      ? neighborhood.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

  const priceMin =
    typeof searchParams.price_min === "string" && searchParams.price_min
      ? Number(searchParams.price_min)
      : undefined;
  const priceMax =
    typeof searchParams.price_max === "string" && searchParams.price_max
      ? Number(searchParams.price_max)
      : undefined;
  const suitesMin =
    typeof searchParams.suites_min === "string" && searchParams.suites_min
      ? Number(searchParams.suites_min)
      : undefined;
  const areaMin =
    typeof searchParams.area_min === "string" && searchParams.area_min
      ? Number(searchParams.area_min)
      : undefined;

  return {
    ...(neighborhoods?.length ? { neighborhoods } : {}),
    ...(priceMin !== undefined && !Number.isNaN(priceMin) ? { priceMin } : {}),
    ...(priceMax !== undefined && !Number.isNaN(priceMax) ? { priceMax } : {}),
    ...(suitesMin !== undefined && !Number.isNaN(suitesMin) ? { suitesMin } : {}),
    ...(areaMin !== undefined && !Number.isNaN(areaMin) ? { areaMin } : {}),
  };
}
