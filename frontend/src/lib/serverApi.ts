import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
export const AUTH_COOKIE_NAME = "amigo_token";

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value;
}

/** Calls the FastAPI backend, forwarding the auth cookie as a Bearer token. */
export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(init.headers);
  // FormData bodies need the browser/fetch-generated multipart boundary —
  // setting Content-Type ourselves would strip it and break the upload.
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
}
