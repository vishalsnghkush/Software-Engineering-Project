import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { authRoutes } from "../routes";
import { getSessionCookie } from "better-auth/cookies";

export const proxy = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);

  console.log("Proxy: ", JSON.stringify(sessionCookie));

  const { nextUrl } = request;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/login",
    "/signup",
  ],
};
