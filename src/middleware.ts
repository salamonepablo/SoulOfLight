import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/checkout", "/orders", "/profile"];

// Rutas solo para administradores
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirigir a login si no está autenticado en rutas protegidas
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir a home si no es admin en rutas de admin
  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto archivos estáticos y API de auth
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
