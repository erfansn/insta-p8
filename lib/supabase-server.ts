import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createMockSupabaseClient } from "./mock-supabase"

/**
 * Create a Supabase server client
 * Use this in API routes and server actions
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || !url.startsWith("http")) {
    return createMockSupabaseClient()
  }

  try {
    const cookieStore = await cookies()

    return createServerClient(url, key, {
      cookies: {
        getAll: async () => cookieStore.getAll(),
        setAll: async (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (error) {
            console.error("[v0] Error setting cookies:", error)
          }
        },
      },
    })
  } catch (error) {
    console.warn("[supabase] Client initialization failed, falling back to mock:", error)
    return createMockSupabaseClient()
  }
}
