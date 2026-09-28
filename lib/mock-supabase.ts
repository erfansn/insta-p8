// In-memory fallback store for Supabase operations when live database credentials are not configured

export interface MockStore {
  users: Array<Record<string, any>>
  automations: Array<Record<string, any>>
  conversations: Array<Record<string, any>>
  messages: Array<Record<string, any>>
  ice_breakers: Array<Record<string, any>>
  media_cache: Array<Record<string, any>>
  unlock_attempts: Array<Record<string, any>>
  [key: string]: Array<Record<string, any>>
}

// Global in-memory storage seeded with sensible defaults
const g = globalThis as unknown as { __mock_db_store__?: MockStore }

if (!g.__mock_db_store__) {
  g.__mock_db_store__ = {
    users: [
      {
        id: "9999999999",
        username: "test_creator",
        access_token: "TEST_TOKEN_NOT_REAL",
        token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        business_account_id: "9999999999",
        page_id: "9999999999",
        ai_context: JSON.stringify({
          business_name: "InstaAuto Studio",
          business_description: "We help digital creators automate their community engagement.",
          services: "Automation workflows, instant DMs, scheduled reels",
          hours_location: "Online 24/7",
          policies: "Standard automated responses with human escalation.",
          faq: "Q: How do auto-replies trigger? A: Based on keywords or post comments.",
        }),
        groq_auto_reply_enabled: false,
        ai_base_url: "",
        ai_model: "",
        groq_api_key: "",
      },
      {
        id: "8888888888",
        username: "lifestyle_agency",
        access_token: "TEST_TOKEN_NOT_REAL_2",
        token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        business_account_id: "8888888888",
        page_id: "8888888888",
        ai_context: JSON.stringify({
          business_name: "Apex Lifestyle Media",
          business_description: "Full-service social media management and brand acceleration.",
          services: "Brand partnerships, Reels strategy, Community Growth",
          hours_location: "Dubai & London / 9am-6pm",
          policies: "Custom contracts and retainer packages.",
          faq: "Q: How to book a call? A: Reply BOOK to schedule directly.",
        }),
        groq_auto_reply_enabled: false,
        ai_base_url: "",
        ai_model: "",
        groq_api_key: "",
      },
      {
        id: "7777777777",
        username: "shop_boutique",
        access_token: "TEST_TOKEN_NOT_REAL_3",
        token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        business_account_id: "7777777777",
        page_id: "7777777777",
        ai_context: JSON.stringify({
          business_name: "Velvet & Stone Apparel",
          business_description: "Minimalist sustainable fashion & accessories.",
          services: "Worldwide shipping, eco-friendly apparel, custom monogramming",
          hours_location: "Online store, worldwide fulfillment",
          policies: "30-day free returns and exchanges.",
          faq: "Q: How long does shipping take? A: 3-5 business days domestically.",
        }),
        groq_auto_reply_enabled: false,
        ai_base_url: "",
        ai_model: "",
        groq_api_key: "",
      },
    ],
    automations: [
      {
        id: "auto-1",
        user_id: "9999999999",
        name: "Pricing Guide",
        trigger_source: "dm",
        trigger_type: "keyword",
        trigger_value: "price",
        response_type: "pro",
        response_content: { message: "Hey there! Our starter package is $49/mo and pro is $99/mo. Check our site for full details!" },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "auto-2",
        user_id: "9999999999",
        name: "Comment: LINK",
        trigger_source: "comment",
        trigger_type: "keyword",
        trigger_value: "link",
        response_type: "pro",
        response_content: { message: "Sent you the direct resource link via DM! Check your requests 📬" },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "auto-3",
        user_id: "8888888888",
        name: "Agency Portfolio",
        trigger_source: "dm",
        trigger_type: "keyword",
        trigger_value: "portfolio",
        response_type: "pro",
        response_content: { message: "Thanks for reaching out! Explore our recent client case studies: https://example.com/portfolio" },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "auto-4",
        user_id: "8888888888",
        name: "Story Reply: COLLAB",
        trigger_source: "story",
        trigger_type: "keyword",
        trigger_value: "collab",
        response_type: "pro",
        response_content: { message: "We love creative collaborations! Please DM us your media kit or portfolio link ✨" },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "auto-5",
        user_id: "7777777777",
        name: "Discount Code: WELCOME10",
        trigger_source: "dm",
        trigger_type: "keyword",
        trigger_value: "discount",
        response_type: "pro",
        response_content: { message: "Welcome to Velvet & Stone! Use code 'WELCOME10' at checkout for 10% off your entire order 🛍️" },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "auto-6",
        user_id: "7777777777",
        name: "Comment: SIZE",
        trigger_source: "comment",
        trigger_type: "keyword",
        trigger_value: "size",
        response_type: "pro",
        response_content: { message: "Our garments fit true-to-size! Check our detailed measurement guide in our highlights." },
        is_active: true,
        specific_media_id: null,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    conversations: [
      {
        id: "conv-1",
        user_id: "9999999999",
        recipient_id: "10001",
        recipient_username: "sarah_designs",
        last_message_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "conv-2",
        user_id: "9999999999",
        recipient_id: "10002",
        recipient_username: "alex_travels",
        last_message_at: new Date(Date.now() - 7200000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "conv-3",
        user_id: "8888888888",
        recipient_id: "20001",
        recipient_username: "clara_pr",
        last_message_at: new Date(Date.now() - 1800000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "conv-4",
        user_id: "7777777777",
        recipient_id: "30001",
        recipient_username: "maya_trends",
        last_message_at: new Date(Date.now() - 900000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    messages: [
      {
        id: "msg-1",
        conversation_id: "conv-1",
        user_id: "9999999999",
        sender_id: "10001",
        sender_username: "sarah_designs",
        content: "Hey! What are your pricing plans?",
        is_from_instagram: true,
        created_at: new Date(Date.now() - 3700000).toISOString(),
      },
      {
        id: "msg-2",
        conversation_id: "conv-1",
        user_id: "9999999999",
        sender_id: "9999999999",
        sender_username: "test_creator",
        content: "Hey there! Our starter package is $49/mo and pro is $99/mo. Check our site for full details!",
        is_from_instagram: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "msg-3",
        conversation_id: "conv-3",
        user_id: "8888888888",
        sender_id: "20001",
        sender_username: "clara_pr",
        content: "Hi! Can you send over your agency portfolio?",
        is_from_instagram: true,
        created_at: new Date(Date.now() - 1900000).toISOString(),
      },
      {
        id: "msg-4",
        conversation_id: "conv-3",
        user_id: "8888888888",
        sender_id: "8888888888",
        sender_username: "lifestyle_agency",
        content: "Thanks for reaching out! Explore our recent client case studies: https://example.com/portfolio",
        is_from_instagram: false,
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "msg-5",
        conversation_id: "conv-4",
        user_id: "7777777777",
        sender_id: "30001",
        sender_username: "maya_trends",
        content: "Do you have any active discount codes for first orders?",
        is_from_instagram: true,
        created_at: new Date(Date.now() - 1000000).toISOString(),
      },
      {
        id: "msg-6",
        conversation_id: "conv-4",
        user_id: "7777777777",
        sender_id: "7777777777",
        sender_username: "shop_boutique",
        content: "Welcome to Velvet & Stone! Use code 'WELCOME10' at checkout for 10% off your entire order 🛍️",
        is_from_instagram: false,
        created_at: new Date(Date.now() - 900000).toISOString(),
      },
    ],
    ice_breakers: [
      {
        id: "ib-1",
        user_id: "9999999999",
        question: "What services do you offer?",
        response: "We offer automation consultation and custom workflow setup!",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "ib-2",
        user_id: "8888888888",
        question: "How do we collaborate?",
        response: "Send us a DM with your handle and project scope!",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "ib-3",
        user_id: "7777777777",
        question: "Track my order",
        response: "Send your order number and email for instant tracking info.",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ],
    media_cache: [],
    unlock_attempts: [],
  }
}

export const mockDbStore = g.__mock_db_store__

class MockQueryBuilder {
  private table: string
  private filters: Array<(row: any) => boolean> = []
  private sortFn: ((a: any, b: any) => number) | null = null
  private limitCount: number | null = null
  private isSingle = false
  private countMode?: "exact" | "planned" | "estimated"
  private isHeadOnly = false
  private operation: "select" | "insert" | "upsert" | "update" | "delete" = "select"
  private pendingData: any = null
  private error: any = null

  constructor(table: string) {
    this.table = table
    if (!mockDbStore[table]) {
      mockDbStore[table] = []
    }
  }

  select(columns = "*", options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    if (options?.count) {
      this.countMode = options.count
    }
    if (options?.head) {
      this.isHeadOnly = true
    }
    return this
  }

  insert(values: any | any[]) {
    this.operation = "insert"
    this.pendingData = values
    return this
  }

  upsert(values: any | any[], _options?: any) {
    this.operation = "upsert"
    this.pendingData = values
    return this
  }

  update(values: any) {
    this.operation = "update"
    this.pendingData = values
    return this
  }

  delete() {
    this.operation = "delete"
    return this
  }

  eq(field: string, value: any) {
    this.filters.push((row) => String(row[field]) === String(value))
    return this
  }

  neq(field: string, value: any) {
    this.filters.push((row) => String(row[field]) !== String(value))
    return this
  }

  in(field: string, values: any[]) {
    const set = new Set(values.map((v) => String(v)))
    this.filters.push((row) => set.has(String(row[field])))
    return this
  }

  order(field: string, options?: { ascending?: boolean }) {
    const ascending = options?.ascending ?? true
    this.sortFn = (a, b) => {
      const valA = a[field]
      const valB = b[field]
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return ascending ? -1 : 1
      if (valB === null || valB === undefined) return ascending ? 1 : -1
      return ascending ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1
    }
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  private execute() {
    const store = mockDbStore[this.table] || []

    if (this.operation === "insert") {
      const rows = Array.isArray(this.pendingData) ? this.pendingData : [this.pendingData]
      const inserted: any[] = []
      for (const r of rows) {
        const item = {
          id: r.id || `${this.table.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          created_at: r.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...r,
        }
        store.push(item)
        inserted.push(item)
      }
      const resultData = this.isSingle ? inserted[0] : Array.isArray(this.pendingData) ? inserted : inserted[0]
      return { data: resultData, error: null, count: inserted.length }
    }

    if (this.operation === "upsert") {
      const rows = Array.isArray(this.pendingData) ? this.pendingData : [this.pendingData]
      const result: any[] = []
      for (const r of rows) {
        const existingIdx = store.findIndex((item) => String(item.id) === String(r.id))
        const item = {
          id: r.id || `${this.table.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          created_at: new Date().toISOString(),
          ...r,
          updated_at: new Date().toISOString(),
        }
        if (existingIdx >= 0) {
          store[existingIdx] = { ...store[existingIdx], ...item }
          result.push(store[existingIdx])
        } else {
          store.push(item)
          result.push(item)
        }
      }
      return { data: this.isSingle ? result[0] : result, error: null }
    }

    if (this.operation === "update") {
      let updatedCount = 0
      const updatedRows: any[] = []
      for (let i = 0; i < store.length; i++) {
        if (this.filters.every((fn) => fn(store[i]))) {
          store[i] = { ...store[i], ...this.pendingData, updated_at: new Date().toISOString() }
          updatedRows.push(store[i])
          updatedCount++
        }
      }
      return { data: this.isSingle ? (updatedRows[0] || null) : updatedRows, error: null, count: updatedCount }
    }

    if (this.operation === "delete") {
      let deletedCount = 0
      for (let i = store.length - 1; i >= 0; i--) {
        if (this.filters.every((fn) => fn(store[i]))) {
          store.splice(i, 1)
          deletedCount++
        }
      }
      return { data: null, error: null, count: deletedCount }
    }

    // Default: SELECT
    let filtered = store.filter((item) => this.filters.every((fn) => fn(item)))
    const totalCount = filtered.length

    if (this.sortFn) {
      filtered = [...filtered].sort(this.sortFn)
    }

    if (this.limitCount !== null) {
      filtered = filtered.slice(0, this.limitCount)
    }

    // Handle joins / mock recipients for message relations
    if (this.table === "messages") {
      const convs = mockDbStore.conversations || []
      filtered = filtered.map((msg) => {
        const conv = convs.find((c) => String(c.id) === String(msg.conversation_id))
        return {
          ...msg,
          recipient: conv ? { recipient_username: conv.recipient_username } : null,
        }
      })
    }

    if (this.isHeadOnly) {
      return { data: null, error: null, count: totalCount }
    }

    if (this.isSingle) {
      const item = filtered[0] ?? null
      return { data: item, error: item ? null : { message: "Row not found", code: "PGRST116" }, count: item ? 1 : 0 }
    }

    return { data: filtered, error: null, count: totalCount }
  }

  // Promise interface
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    const res = this.execute()
    return Promise.resolve(res).then(onfulfilled, onrejected)
  }
}

export function createMockSupabaseClient(): any {
  return {
    from: (table: string) => new MockQueryBuilder(table),
    rpc: async (fn: string, _args?: any) => {
      if (fn === "exec_sql") {
        return { data: null, error: null }
      }
      return { data: null, error: null }
    },
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  }
}
