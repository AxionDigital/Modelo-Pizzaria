import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  console.log("COOKIES NO MIDDLEWARE:", req.cookies.getAll());

  const token = req.cookies.get("token")?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // ❌ Não logado tentando acessar admin
  if (isAdminRoute && !token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🔐 Se tem token, valida
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);

      // ✅ Logado tentando acessar login
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch {
      // ❌ Token inválido → limpa cookie e volta pro login
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
