import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

// Static routes that should NOT be handled by [slug] dynamic route
const STATIC_ROUTES = [
  "/buscar",
  "/cadastrar",
  "/painel",
  "/admin",
  "/auth",
  "/api",
  "/setup",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // For static routes, let Next.js handle them normally
  // This ensures they don't get caught by [slug]
  const isStaticRoute = STATIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isStaticRoute) {
    return await updateSession(request);
  }
  
  // For all other routes (including business slugs), update session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
