import type { NextRequest } from "next/server"

import { appClient, onboardingClient } from "./lib/auth0" // Adjust path if your auth0 client is elsewhere

import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export async function middleware(request: NextRequest) {
  if (request.url.includes("/onboarding")) {
    return await onboardingClient.middleware(request)
  } else {
    return await appClient.middleware(request)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)",
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
}
