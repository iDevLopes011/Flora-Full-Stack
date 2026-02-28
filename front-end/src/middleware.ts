import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "flora_token";

const PUBLIC_ROUTES = ["/signin", "/signup"];

const AUTH_ONLY_ROUTES = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(token);
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthenticated && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
