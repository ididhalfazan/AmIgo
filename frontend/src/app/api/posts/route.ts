import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await backendFetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
