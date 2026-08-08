import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "0";

  const res = await backendFetch(`/api/users/me/posts?page=${page}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
