"use client"

import React, { useState } from "react"
import {
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
  LogOut,
  ArrowRight,
  Instagram,
  UserCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import type { InstagramAccount } from "@/lib/types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AccountSwitcherProps {
  collapsed?: boolean
  className?: string
  showBadge?: boolean
}

export function AccountSwitcher({ collapsed = false, className, showBadge = false }: AccountSwitcherProps) {
  const {
    activeAccount,
    accounts,
    switchAccount,
    removeAccount,
    logout,
    logoutAll,
  } = useInstagramSession()

  const [dialogOpen, setDialogOpen] = useState(false)

  const activeUserId = activeAccount?.userId
  const username = activeAccount?.username || "creator"
  const profilePic = activeAccount?.profilePic

  const handleOAuthConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI

    if (!clientId || !redirectUri) {
      toast.error("Instagram OAuth credentials (NEXT_PUBLIC_INSTAGRAM_APP_ID or NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI) are not configured.")
      return
    }

    window.location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments`
  }

  const handleRemove = (e: React.MouseEvent, acc: InstagramAccount) => {
    e.stopPropagation()
    if (accounts.length <= 1) {
      toast.error("You must have at least one connected account.")
      return
    }
    removeAccount(acc.userId)
    toast.info(`Disconnected @${acc.username}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Switch account"
            className={cn(
              "group relative flex w-full items-center rounded-xl transition-all duration-150 outline-none select-none",
              collapsed
                ? "size-10 justify-center p-0 hover:bg-sidebar-accent"
                : "gap-2.5 bg-sidebar-accent/80 p-2 text-left hover:bg-sidebar-accent border border-sidebar-border/60 hover:border-sidebar-border",
              className
            )}
          >
            {/* Avatar */}
            <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground text-xs shadow-sm ring-1 ring-border">
              {profilePic ? (
                <img src={profilePic} alt={username} className="size-full object-cover" />
              ) : (
                username.charAt(0).toUpperCase()
              )}
              {/* Online pulse indicator */}
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            {/* Account Info */}
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-semibold text-sidebar-foreground">
                      @{username}
                    </p>
                    {showBadge && (
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-[9px] font-medium text-primary">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {accounts.length} {accounts.length === 1 ? "account" : "accounts"} connected
                  </p>
                </div>
                <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={collapsed ? "center" : "start"}
          side={collapsed ? "right" : "top"}
          sideOffset={8}
          className="w-72 rounded-xl p-1.5 shadow-xl border border-border bg-popover"
        >
          <DropdownMenuLabel className="flex items-center justify-between px-2.5 py-1.5 text-xs text-muted-foreground font-normal">
            <span>Instagram Accounts</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground">
              {accounts.length}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          {/* Accounts List */}
          <DropdownMenuGroup className="space-y-0.5">
            {accounts.map((acc) => {
              const isSelected = acc.userId === activeUserId
              return (
                <DropdownMenuItem
                  key={acc.userId}
                  onClick={() => switchAccount(acc.userId)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs cursor-pointer group transition-colors",
                    isSelected
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-[11px] font-semibold text-foreground ring-1 ring-border">
                      {acc.profilePic ? (
                        <img src={acc.profilePic} alt={acc.username} className="size-full object-cover" />
                      ) : (
                        acc.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-foreground font-medium">@{acc.username}</p>
                      {acc.name && acc.name !== acc.username && (
                        <p className="truncate text-[10px] text-muted-foreground">{acc.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    ) : null}

                    {accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, acc)}
                        title={`Disconnect @${acc.username}`}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity rounded hover:bg-background/80"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Add Account Trigger */}
          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
          >
            <div className="flex size-6 items-center justify-center rounded-md border border-dashed border-border text-foreground">
              <Plus className="size-3.5" />
            </div>
            <span>Connect Instagram Account</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Logout Actions */}
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Log out of @{username}</span>
          </DropdownMenuItem>

          {accounts.length > 1 && (
            <DropdownMenuItem
              onClick={logoutAll}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Log out of all accounts</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Connect Account Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Connect Instagram Account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Connect another Instagram professional or creator account via Meta OAuth to manage automations and conversations in one place.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-sm">
                <Instagram className="size-6" />
              </div>
              <h4 className="mt-3.5 text-sm font-semibold text-foreground">Official Instagram Login</h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Authorize your business or creator page with Instagram. Tokens and webhook permissions will be securely linked for direct message and comment automations.
              </p>
              <button
                type="button"
                onClick={handleOAuthConnect}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Authorize with Instagram
                <ArrowRight className="size-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Make sure the Instagram account is set to Professional or Creator mode and linked to a Facebook Page if required by Meta.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
