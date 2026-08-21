import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function GET() {
  const res = await backendFetch("/api/communities");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await backendFetch("/api/communities", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
