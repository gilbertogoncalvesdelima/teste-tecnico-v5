import { fetchProperties } from "@/lib/api";
import { getRequestOrigin } from "@/lib/requestOrigin";
import { getPropertiesFromMockServer } from "@/lib/mockPropertiesServer";
import { ImoveisLayout } from "./components/ImoveisLayout";
import { searchParamsToFilters } from "./searchParamsToFilters";

export const dynamic = "force-dynamic";

interface ImoveisPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const [params, origin] = await Promise.all([searchParams, getRequestOrigin()]);
  const filters = searchParamsToFilters(params);
  let properties;
  try {
    properties = await fetchProperties(filters, origin);
  } catch {
    if (process.env.NODE_ENV === "development") {
      properties = getPropertiesFromMockServer(filters);
    } else {
      throw new Error("API error: unable to load properties");
    }
  }

  return <ImoveisLayout properties={properties} />;
}
