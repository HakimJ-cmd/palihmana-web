import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "palihmana-super-secret-key-2026-editorial-system"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── 1. Cyber Security Headers ────────────────────────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // Content-Security-Policy (CSP) mitigates HTML injection and XSS
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' https: data: blob:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // ─── 2. Route Guard & Token Verification ──────────────────────────
  const sessionCookie = request.cookies.get("palihmana_session")?.value;

  let isValidSession = false;
  let userRole = "";

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, SECRET_KEY, {
        algorithms: ["HS256"],
      });
      isValidSession = true;
      userRole = (payload.role as string) || "";
    } catch {
      // Invalid/tampered JWT signature
      isValidSession = false;
    }
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isValidSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      // Clean up invalid session cookie if forged
      redirectRes.cookies.delete("palihmana_session");
      return redirectRes;
    }

    // Role check: Only SUPER_ADMIN, EDITOR, CONTRIBUTOR can access /admin
    const staffRoles = ["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"];
    if (!staffRoles.includes(userRole)) {
      // Member trying to access admin is redirected to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /akun routes (requires valid session of any role)
  if (pathname.startsWith("/akun")) {
    if (!isValidSession) {
      const loginUrl = new URL("/masuk", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as staff, redirect /admin/login to /admin dashboard
  if (pathname === "/admin/login" && isValidSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If already logged in, redirect /masuk and /daftar to /akun
  if ((pathname === "/masuk" || pathname === "/daftar") && isValidSession) {
    return NextResponse.redirect(new URL("/akun", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes can handle their own auth headers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
