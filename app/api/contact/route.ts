import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api/config";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const locale = request.headers.get("x-localization") ?? "ar";

  const response = await fetch(apiUrl("/contact"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-localization": locale,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => ({
    message: "Failed to submit contact message",
  }));

  return NextResponse.json(json, { status: response.status });
}
