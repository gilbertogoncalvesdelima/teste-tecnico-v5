import { fetchPropertyBySlug } from "@/lib/api";
import { getRequestOrigin } from "@/lib/requestOrigin";
import { getPropertyBySlugFromMock } from "@/lib/mockPropertiesServer";
import { PropertyPageClient } from "./components/PropertyPageClient";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const [{ slug }, origin] = await Promise.all([params, getRequestOrigin()]);
  let property;
  try {
    property = await fetchPropertyBySlug(slug, origin);
  } catch {
    if (process.env.NODE_ENV === "development") {
      property = getPropertyBySlugFromMock(slug);
    } else {
      throw new Error("API error: unable to load property");
    }
  }
  if (property === null && process.env.NODE_ENV === "development") {
    property = getPropertyBySlugFromMock(slug);
  }

  if (!property) {
    return <p>Imóvel não encontrado</p>;
  }

  return <PropertyPageClient property={property} />;
}
