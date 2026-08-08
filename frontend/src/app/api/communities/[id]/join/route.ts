import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await backendFetch(`/api/communities/${id}/join`, { method: "POST" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
