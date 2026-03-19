import { headers } from "next/headers";

export async function getRequestOrigin(): Promise<string> {
  const list = await headers();
  const host = list.get("host") ?? "localhost:3000";
  const proto = list.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
