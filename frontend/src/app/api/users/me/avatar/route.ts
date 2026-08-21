import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/serverApi";

export async function POST(request: Request) {
  const formData = await request.formData();

  const res = await backendFetch("/api/users/me/avatar", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
