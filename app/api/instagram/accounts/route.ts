import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { mockDbStore } from "@/lib/mock-supabase"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, created_at, updated_at, ai_context")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const accounts = (users || []).map((u: any) => ({
      userId: String(u.id),
      username: u.username || `user_${u.id}`,
      profilePic: null,
      addedAt: u.created_at || u.updated_at,
    }))

    return NextResponse.json({ accounts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, userId: customId, bio, name } = body

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const cleanUsername = username.replace(/^@/, "").trim().toLowerCase()
    const finalUserId = customId ? String(customId) : String(Math.floor(1000000000 + Math.random() * 9000000000))

    const supabase = await getSupabaseServerClient()

    const newUser = {
      id: finalUserId,
      username: cleanUsername,
      access_token: "TEST_TOKEN_" + finalUserId,
      token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      business_account_id: finalUserId,
      page_id: finalUserId,
      ai_context: JSON.stringify({
        business_name: name || `@${cleanUsername}`,
        business_description: bio || `Automated Instagram profile for @${cleanUsername}`,
        services: "Direct messages and comment automations",
        hours_location: "Online",
        policies: "Standard automated responses",
        faq: "Q: How to contact? A: DM us anytime!",
      }),
      groq_auto_reply_enabled: false,
    }

    const { error: upsertError } = await supabase.from("users").upsert(newUser)
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    // Seed a starter automation for this new account
    const starterAutomation = {
      id: "auto-" + Date.now(),
      user_id: finalUserId,
      name: "Welcome DM",
      trigger_source: "dm",
      trigger_type: "keyword",
      trigger_value: "hello",
      response_type: "pro",
      response_content: { message: `Hi there! Thanks for messaging @${cleanUsername}! How can we help today?` },
      is_active: true,
      created_at: new Date().toISOString(),
    }
    await supabase.from("automations").insert(starterAutomation)

    // Also ensure mockDbStore gets the record if running in mock mode
    if (mockDbStore) {
      const existingIdx = mockDbStore.users.findIndex((u) => String(u.id) === finalUserId)
      if (existingIdx >= 0) {
        mockDbStore.users[existingIdx] = { ...mockDbStore.users[existingIdx], ...newUser }
      } else {
        mockDbStore.users.push(newUser)
      }
    }

    return NextResponse.json({
      success: true,
      account: {
        userId: finalUserId,
        username: cleanUsername,
        name: name || cleanUsername,
        profilePic: null,
        addedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()
    await supabase.from("automations").delete().eq("user_id", userId)
    await supabase.from("messages").delete().eq("user_id", userId)
    await supabase.from("conversations").delete().eq("user_id", userId)
    await supabase.from("ice_breakers").delete().eq("user_id", userId)
    await supabase.from("users").delete().eq("id", userId)

    return NextResponse.json({ success: true, message: `Account ${userId} removed` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
