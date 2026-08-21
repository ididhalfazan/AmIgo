import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "0";

  const res = await backendFetch(`/api/communities/${id}/feed?page=${page}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
