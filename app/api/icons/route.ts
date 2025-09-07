import { NextRequest } from "next/server";

export const dynamic = "auto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const size = searchParams.get("size") || "32";

  if (!domain)
    return Response.json({ error: "Missing domain" }, { status: 400 });

  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  const response = await fetch(url, { cache: "force-cache" });

  if (response.status === 200) {
    return new Response(response.body);
  } else if (response.status === 404) {
    return Response.json({ error: "Domain not found" }, { status: 404 });
  } else {
    return Response.json({ error: "Failed to fetch icon" }, { status: 500 });
  }
}
