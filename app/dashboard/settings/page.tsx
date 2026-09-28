"use client"

import { useEffect, useState } from "react"
import { Save, Loader2, Check } from "lucide-react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher"

const fields = [
    ["business_name", "Business name", "What should customers call your business?"],
    ["business_description", "What you do", "Describe your business and main offer."],
    ["services", "Services and prices", "List services, products, prices, and key details."],
    ["hours_location", "Hours and location", "Add opening hours, location, delivery, or service area."],
    ["policies", "Policies", "Add booking, refund, cancellation, and payment policies."],
    ["faq", "Frequently asked questions", "Add common customer questions and approved answers."],
] as const

export default function SettingsPage() {
    const { userId, username, isLoading: sessionLoading } = useInstagramSession()
    const [knowledge, setKnowledge] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!userId) return
        setLoading(true)
        fetch(`/api/business-profile?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setKnowledge(data.knowledge ?? {}))
            .finally(() => setLoading(false))
    }, [userId])

    const update = (key: string, value: string) => setKnowledge((current) => ({ ...current, [key]: value }))

    const save = async () => {
        if (!userId || saving) return
        setSaving(true)
        const res = await fetch("/api/business-profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, knowledge }),
        })
        if (res.ok) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }
        setSaving(false)
    }

    if (sessionLoading || loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>

    return (
        <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-7">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Workspace settings</p>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground border border-border/60">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            @{username || "creator"}
                        </span>
                    </div>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-foreground">Preferences</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Give your assistant accurate business information for better replies.</p>
                </div>
                <div className="w-56 shrink-0">
                    <AccountSwitcher showBadge />
                </div>
            </div>
            <div className="mt-7 space-y-5 rounded-xl border border-border bg-card p-6">
                {fields.map(([key, label, placeholder]) => (
                    <label key={key} className="block space-y-2">
                        <span className="text-sm font-medium text-foreground">{label}</span>
                        <textarea value={knowledge[key] ?? ""} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} rows={key === "business_name" ? 2 : 4} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </label>
                ))}
            </div>
            <button onClick={save} disabled={saving} className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved" : "Save business knowledge"}
            </button>
        </div>
    )
}
