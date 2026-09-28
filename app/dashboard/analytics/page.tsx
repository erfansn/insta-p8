"use client"

import { useEffect, useState } from "react"
import { Activity, ArrowUpRight, BarChart3, MessageSquare, Users, CheckCircle2 } from "lucide-react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher"

export default function AnalyticsPage() {
  const { userId, username, isLoading: sessionLoading } = useInstagramSession()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/dashboard/stats?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data)
      })
      .catch((err) => console.error("Failed to load analytics", err))
  }, [userId])

  const metrics = stats?.metrics

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-7">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Performance</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground border border-border/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              @{username || "creator"}
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Insights</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Understand how people engage with your automated conversations.
          </p>
        </div>
        <div className="w-56 shrink-0">
          <AccountSwitcher showBadge />
        </div>
      </header>

      <div className="grid border-b border-border sm:grid-cols-4">
        <Metric
          label="Conversations"
          value={metrics?.messagesSent !== undefined ? metrics.messagesSent.toLocaleString() : "—"}
          icon={MessageSquare}
        />
        <Metric
          label="People reached"
          value={metrics?.audienceReached !== undefined ? metrics.audienceReached.toLocaleString() : "—"}
          icon={Users}
        />
        <Metric
          label="Active workflows"
          value={metrics?.activeTriggers !== undefined ? metrics.activeTriggers.toLocaleString() : "—"}
          icon={Activity}
        />
        <Metric
          label="Total triggers"
          value={metrics?.totalAutomations !== undefined ? metrics.totalAutomations.toLocaleString() : "—"}
          icon={CheckCircle2}
        />
      </div>

      <section className="mt-7 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Performance over time for @{username || "creator"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Conversation activity across direct messages, comments, and story reactions.
            </p>
          </div>
          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Last 30 days
          </span>
        </div>
        <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary">
            <BarChart3 className="size-5 text-muted-foreground" />
          </span>
          <h3 className="mt-4 text-sm font-medium">Insights tracked for @{username}</h3>
          <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
            {metrics?.totalAutomations ? (
              <>
                You currently have <strong>{metrics.totalAutomations}</strong> automation workflows configured for this account.
              </>
            ) : (
              "Once your workflows begin sending messages, performance and audience trends will show here."
            )}
          </p>
          <a
            href="/dashboard/automations"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            Review workflows
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </section>
    </div>
  )
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="border-border py-6 sm:border-r sm:px-6 first:pl-0 last:border-r-0">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  )
}
