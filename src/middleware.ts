import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "sign-in", "sign-up", "/settings"],
  afterAuth(auth, req: NextRequest) {
    // Handle authenticated users
    if (auth.userId && req.nextUrl.pathname === "/") {
      const appHome = new URL("/dashboard", req.url);
      return NextResponse.redirect(appHome);
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
