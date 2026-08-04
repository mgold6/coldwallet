export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/portfolio/:path*",
    "/settings/:path*",
  ],
};