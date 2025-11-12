import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  let cookieStore: any = null;

  try {
    const { cookies } = await import("next/headers");
    cookieStore = await cookies();
  } catch (error) {
    console.warn("cookies() not available, using fallback mode");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll() || [];
        },
        setAll(cookiesToSet) {
          if (cookieStore) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          }
        },
      },
    }
  );
}
