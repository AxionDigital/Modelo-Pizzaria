import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // Não logado tentando acessar admin
  if (isAdminRoute && !token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Logado tentando acessar login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
