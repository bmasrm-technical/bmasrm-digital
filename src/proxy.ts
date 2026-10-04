import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return false;
  if (url.includes("placeholder") || url.includes("your-project") || url.includes("your-supabase-project")) {
    return false;
  }
  return true;
}

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (!isSupabaseConfigured()) {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (fetchUrl, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        return fetch(fetchUrl, {
          ...options,
          signal: options?.signal || controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Gate /admin/* routes except /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!user) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    // Redirect logged-in admin away from /admin/login to /admin
    if (pathname === "/admin/login" && user) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
