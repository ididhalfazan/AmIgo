import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/serverApi";

const PROTECTED_ROUTES = [
  "/feed",
  "/communities",
  "/notifications",
  "/profile",
  "/friends",
  "/settings",
];
const AUTH_ROUTES = ["/login", "/register"];

// Optimistic check only — this just looks for cookie presence, it does not
// verify the JWT signature. Real authorization happens on every backend
// request via the FastAPI auth dependency. See plan.md's authentication
// notes and Next.js's "Optimistic checks with Proxy" guidance.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
