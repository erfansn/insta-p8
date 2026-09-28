"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { InstagramAccount } from "@/lib/types"

const STORAGE_ACCOUNTS_KEY = "ig_accounts"
const STORAGE_USER_ID_KEY = "ig_user_id"
const STORAGE_USERNAME_KEY = "ig_username"
const STORAGE_PROFILE_PIC_KEY = "ig_profile_pic"

// Module-level in-memory cache to guarantee reference stability and sync across all hooks
let globalAccounts: InstagramAccount[] | null = null
let globalActiveUserId: string | null = null
let isInitialized = false
const subscribers = new Set<() => void>()

function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb()
    } catch (err) {
      console.error("[useInstagramSession] Subscriber error:", err)
    }
  })
}

function loadFromStorage(): { accounts: InstagramAccount[]; activeId: string | null } {
  if (typeof window === "undefined") {
    return { accounts: [], activeId: null }
  }

  let accounts: InstagramAccount[] = []
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        accounts = parsed
      }
    }
  } catch (e) {
    console.error("Failed to parse stored accounts:", e)
  }

  // If no list in STORAGE_ACCOUNTS_KEY, check for a single active session from OAuth
  if (accounts.length === 0) {
    const legacyId = localStorage.getItem(STORAGE_USER_ID_KEY)
    const legacyName = localStorage.getItem(STORAGE_USERNAME_KEY)
    const legacyPic = localStorage.getItem(STORAGE_PROFILE_PIC_KEY)

    if (legacyId && legacyName) {
      accounts = [
        {
          userId: legacyId,
          username: legacyName,
          profilePic: legacyPic || null,
          addedAt: new Date().toISOString(),
        },
      ]
      try {
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts))
      } catch {}
    }
  }

  let activeId = localStorage.getItem(STORAGE_USER_ID_KEY)
  let activeAcc = accounts.find((a) => a.userId === activeId)
  if (!activeAcc && accounts.length > 0) {
    activeAcc = accounts[0]
    activeId = activeAcc.userId
    try {
      localStorage.setItem(STORAGE_USER_ID_KEY, activeAcc.userId)
      localStorage.setItem(STORAGE_USERNAME_KEY, activeAcc.username)
      if (activeAcc.profilePic) {
        localStorage.setItem(STORAGE_PROFILE_PIC_KEY, activeAcc.profilePic)
      } else {
        localStorage.removeItem(STORAGE_PROFILE_PIC_KEY)
      }
      document.cookie = `insta_session=${encodeURIComponent(
        JSON.stringify({ username: activeAcc.username, userId: activeAcc.userId })
      )}; path=/; max-age=5184000; SameSite=Lax`
    } catch {}
  } else if (accounts.length === 0) {
    activeId = null
  }

  return { accounts, activeId }
}

function ensureInitialized() {
  if (isInitialized && globalAccounts !== null) return
  if (typeof window === "undefined") return

  const { accounts, activeId } = loadFromStorage()
  globalAccounts = accounts
  globalActiveUserId = activeId
  isInitialized = true
}

function setSessionCookiesAndStorage(account: InstagramAccount | null) {
  if (typeof window === "undefined") return
  if (account) {
    localStorage.setItem(STORAGE_USER_ID_KEY, account.userId)
    localStorage.setItem(STORAGE_USERNAME_KEY, account.username)
    if (account.profilePic) {
      localStorage.setItem(STORAGE_PROFILE_PIC_KEY, account.profilePic)
    } else {
      localStorage.removeItem(STORAGE_PROFILE_PIC_KEY)
    }
    document.cookie = `insta_session=${encodeURIComponent(
      JSON.stringify({ username: account.username, userId: account.userId })
    )}; path=/; max-age=5184000; SameSite=Lax`
  } else {
    localStorage.removeItem(STORAGE_USER_ID_KEY)
    localStorage.removeItem(STORAGE_USERNAME_KEY)
    localStorage.removeItem(STORAGE_PROFILE_PIC_KEY)
    document.cookie = "insta_session=; Max-Age=0; path=/;"
  }
}

export function switchAccountGlobally(targetUserId: string) {
  ensureInitialized()
  if (!globalAccounts) return
  const target = globalAccounts.find((a) => a.userId === targetUserId)
  if (!target) return

  globalActiveUserId = target.userId
  setSessionCookiesAndStorage(target)
  notifySubscribers()
}

export function addAccountGlobally(account: InstagramAccount, makeActive = true) {
  ensureInitialized()
  const list = globalAccounts ? [...globalAccounts] : []
  const existingIndex = list.findIndex((a) => a.userId === account.userId)

  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...account }
  } else {
    list.unshift(account)
  }

  globalAccounts = list
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(list))
  } catch {}

  if (makeActive) {
    globalActiveUserId = account.userId
    setSessionCookiesAndStorage(account)
  }

  notifySubscribers()
}

export function removeAccountGlobally(targetUserId: string): boolean {
  ensureInitialized()
  if (!globalAccounts) return false
  const updatedList = globalAccounts.filter((a) => a.userId !== targetUserId)
  globalAccounts = updatedList

  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedList))
  } catch {}

  const wasActive = globalActiveUserId === targetUserId
  if (wasActive) {
    if (updatedList.length > 0) {
      globalActiveUserId = updatedList[0].userId
      setSessionCookiesAndStorage(updatedList[0])
    } else {
      globalActiveUserId = null
      setSessionCookiesAndStorage(null)
    }
  }

  notifySubscribers()
  return updatedList.length > 0
}

export function logoutAllGlobally() {
  globalAccounts = []
  globalActiveUserId = null
  try {
    localStorage.removeItem(STORAGE_ACCOUNTS_KEY)
  } catch {}
  setSessionCookiesAndStorage(null)
  notifySubscribers()
}

export function useInstagramSession() {
  const [mounted, setMounted] = useState(false)
  const [, setTick] = useState(0)
  const [, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    ensureInitialized()
    setMounted(true)

    const handleUpdate = () => {
      startTransition(() => {
        setTick((t) => t + 1)
      })
    }

    subscribers.add(handleUpdate)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_ACCOUNTS_KEY || e.key === STORAGE_USER_ID_KEY) {
        const { accounts, activeId } = loadFromStorage()
        globalAccounts = accounts
        globalActiveUserId = activeId
        notifySubscribers()
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      subscribers.delete(handleUpdate)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  // Handle incoming OAuth callback code once
  useEffect(() => {
    if (!mounted) return
    const code = searchParams?.get("code")
    if (!code) return

    let isMounted = true

    const handleOAuth = async () => {
      try {
        const res = await fetch("/api/instagram/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
        const data = await res.json()

        if (isMounted && data.success) {
          const newAcc: InstagramAccount = {
            userId: String(data.userId),
            username: data.username,
            profilePic: data.profilePic || null,
            addedAt: new Date().toISOString(),
          }
          addAccountGlobally(newAcc, true)
          router.replace("/dashboard")
        }
      } catch (err) {
        console.error("Login / Add Account failed:", err)
      }
    }

    handleOAuth()

    return () => {
      isMounted = false
    }
  }, [mounted, searchParams, router])

  const accounts = mounted && globalAccounts ? globalAccounts : []
  const activeAccount =
    mounted && globalAccounts && globalActiveUserId
      ? globalAccounts.find((a) => a.userId === globalActiveUserId) || globalAccounts[0] || null
      : null

  const switchAccount = useCallback((targetUserId: string) => {
    switchAccountGlobally(targetUserId)
  }, [])

  const addAccount = useCallback((account: InstagramAccount, makeActive = true) => {
    addAccountGlobally(account, makeActive)
  }, [])

  const removeAccount = useCallback(
    (targetUserId: string) => {
      const hasRemaining = removeAccountGlobally(targetUserId)
      if (!hasRemaining) {
        router.push("/")
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    if (activeAccount) {
      removeAccount(activeAccount.userId)
    } else {
      router.push("/")
    }
  }, [activeAccount, removeAccount, router])

  const logoutAll = useCallback(() => {
    logoutAllGlobally()
    router.push("/")
  }, [router])

  return {
    userId: activeAccount?.userId || null,
    username: activeAccount?.username || null,
    profilePic: activeAccount?.profilePic || null,
    activeAccount,
    accounts,
    isLoading: !mounted,
    switchAccount,
    addAccount,
    removeAccount,
    logout,
    logoutAll,
  }
}
