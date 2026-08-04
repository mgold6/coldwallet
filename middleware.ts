export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};