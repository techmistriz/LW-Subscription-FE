import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match: /category/anything/slug
  const match = pathname.match(/^\/category\/[^/]+\/([^/]+)/);

  if (match) {
    const slug = match[1];

    const url = request.nextUrl.clone();
    url.pathname = `/${slug}`;

    // 301 redirect (SEO friendly)
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}