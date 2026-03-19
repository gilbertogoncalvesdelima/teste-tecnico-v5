import { NextRequest } from "next/server";
import { mockProperties } from "../mockData";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const property = mockProperties.find((p) => p.slug === slug);

  if (!property) {
    return new Response(null, { status: 404 });
  }

  return Response.json(property);
}
