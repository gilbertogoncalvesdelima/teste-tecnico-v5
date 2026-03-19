import type { Property, PropertySummary } from "@repo/shared/domain/Property";

const NEIGHBORHOOD_COUNTS: Record<string, number> = {
  Jardins: 14,
  "Vila Madalena": 8,
  Pinheiros: 15,
  "Itaim Bibi": 7,
  Moema: 9,
  "Vila Olímpia": 5,
  Brooklin: 11,
  "Campo Belo": 4,
  "Vila Nova Conceição": 6,
  Perdizes: 10,
  "Alto de Pinheiros": 3,
  Consolação: 9,
};

function photosForSlug(slug: string): string[] {
  return [
    `https://picsum.photos/seed/${slug}-1/400/300`,
    `https://picsum.photos/seed/${slug}-2/400/300`,
    `https://picsum.photos/seed/${slug}-3/400/300`,
  ];
}

const TITLES = [
  "Apartamento",
  "Casa",
  "Cobertura",
  "Sobrado",
  "Loft",
  "Studio",
  "Flat",
];

const DESCRIPTIONS = [
  "Excelente imóvel em condomínio fechado, com acabamento de alto padrão.",
  "Ótima localização, próximo ao metrô e comércio.",
  "Imóvel amplo, ideal para família. Área de lazer completa.",
  "Reformado recentemente. Pronto para morar.",
  "Vista privilegiada. Condomínio com piscina e academia.",
  "Próximo a bares, restaurantes e parques.",
  "Condomínio com segurança 24h e portaria.",
];

const AMENITIES_POOL = [
  "Piscina",
  "Academia",
  "Salão de festas",
  "Churrasqueira",
  "Portaria 24h",
  "Playground",
  "Quadra",
  "Sauna",
  "Área gourmet",
];

const STATUSES: Property["status"][] = ["available", "available", "available", "reserved", "sold"];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function buildMockProperties(): Property[] {
  const list: Property[] = [];
  let globalIndex = 0;

  for (const [neighborhood, count] of Object.entries(NEIGHBORHOOD_COUNTS)) {
    const slugBase = neighborhood.toLowerCase().replace(/\s+/g, "-");
    for (let i = 0; i < count; i++) {
      globalIndex += 1;
      const id = String(globalIndex);
      const suites = (i % 5) + 1;
      const area = 60 + (i % 20) * 15 + (globalIndex % 50);
      const priceCents = (80 + (i % 15) * 20 + (globalIndex % 30)) * 100000 * 100;
      const isLuxury = priceCents >= 500000000;
      const price = isLuxury ? Math.round(priceCents / 100) : priceCents;
      const slug = `${slugBase}-${id}-${i}`;
      const title = `${pick(TITLES, globalIndex)} ${suites} suítes ${neighborhood}`;

      list.push({
        id,
        slug,
        title,
        description: pick(DESCRIPTIONS, globalIndex + i),
        neighborhood,
        price,
        ...(isLuxury && { priceInReais: true }),
        area,
        bedrooms: suites + (i % 2),
        suites,
        parkingSpots: Math.min(suites, 3),
        status: pick(STATUSES, globalIndex + i),
        notes: [],
        photos: photosForSlug(slug),
        amenities: AMENITIES_POOL.slice(0, 2 + (i % 4)),
        updatedAt: Date.now() - (100000 - globalIndex) * 100,
        updatedBy: i % 3 === 0 ? "field_agent" : "backoffice",
      });
    }
  }

  return list;
}

export const mockProperties: Property[] = buildMockProperties();

export function getMockSummaries(): PropertySummary[] {
  return mockProperties.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    neighborhood: p.neighborhood,
    price: p.price,
    priceInReais: p.priceInReais,
    area: p.area,
    suites: p.suites,
    photos: p.photos.slice(0, 3),
    status: p.status,
    updatedAt: p.updatedAt,
  }));
}
