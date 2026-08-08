import axios from "axios";

/**
 * Calls Next.js's own /api/* route handlers (same-origin), which proxy to
 * the FastAPI backend and set the JWT in an httpOnly cookie. See plan.md >
 * Architecture Notes for why auth never talks to the backend directly from
 * the browser.
 */
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (error.response?.status === 404) {
      return "Auth service isn't wired up yet — backend integration is next.";
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
