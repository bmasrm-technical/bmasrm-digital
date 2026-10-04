import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  if (!url || !key) return false;
  if (
    url.includes("placeholder") ||
    url.includes("your-supabase-project") ||
    url.includes("your-project")
  ) {
    return false;
  }
  return true;
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options) => {
        // Enforce 3-second timeout so server components never hang for 30s+
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        return fetch(url, {
          ...options,
          signal: options?.signal || controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware/proxy refreshing sessions.
        }
      },
    },
  });
}
