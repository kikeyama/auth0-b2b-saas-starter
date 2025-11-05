import type { NextRequest } from 'next/server'

import { appClient, onboardingClient } from "./lib/auth0" // Adjust path if your auth0 client is elsewhere

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
/*
  if (request.url.includes("/onboarding")) {
    return await onboardingClient.middleware(request);
  } else if (request.url.includes("/auth")) {
    return await appClient.middleware(request);
  } else {
    return intlMiddleware(request);
  }
*/

  // auth0 and next-intl example from https://github.com/auth0/nextjs-auth0/blob/main/examples/with-next-intl/middleware.ts
  const appResponse = await appClient.middleware(request)
  const onboardingResponse = await onboardingClient.middleware(request)

  if (request.nextUrl.pathname.startsWith("/onboarding")) {
    // if path starts with /onboarding, let the onboarding middleware handle it
    return onboardingResponse
  } else if (request.nextUrl.pathname.startsWith("/auth")) {
    // if path starts with /auth, let the app middleware handle it
    return appResponse
  }

  // call any other middleware here
  const intlRes = intlMiddleware(request)

  // Combine headers from authResponse (from auth0.middleware) and intlRes (from intlMiddleware).
  // If authResponse contains 'x-middleware-next' (signaling Next.js to proceed to the page),
  // but intlRes is a response that should terminate the request chain (like a redirect or an error),
  // we must NOT copy 'x-middleware-next' from authResponse. Doing so would override
  // intlRes's decision to stop the request.
  for (const [key, value] of appResponse.headers) {
    if (key.toLowerCase() === 'x-middleware-next') {
      // Check if intlRes is a redirect (3xx status code) or an error (4xx, 5xx status code).
      const isIntlResponseTerminating = intlRes.status >= 300;
      if (isIntlResponseTerminating) {
        // If intlRes is already redirecting or returning an error,
        // do not copy 'x-middleware-next' from authResponse.
        // This allows intlRes's redirect/error to take effect.
        continue;
      }
    }
    // For all other headers, or if 'x-middleware-next' can be safely copied,
    // append them to intlRes. The append() method adds the header if it doesn't exist,
    // or appends the value if it does. This correctly preserves multi-value headers
    // like set-cookie. HTTP allows multiple headers with the same name, and using
    // append() ensures all cookie values are preserved instead of overwriting.
    intlRes.headers.append(key, value);
  }

  for (const [key, value] of onboardingResponse.headers) {
    if (key.toLowerCase() === 'x-middleware-next') {
      const isIntlResponseTerminating = intlRes.status >= 300;
      if (isIntlResponseTerminating) {
        continue;
      }
    }
    intlRes.headers.append(key, value);
  }

  return intlRes
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
//    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)",
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
}
