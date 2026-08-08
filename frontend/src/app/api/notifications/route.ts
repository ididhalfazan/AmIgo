import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function GET() {
  const res = await backendFetch("/api/notifications");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
