"use client"

import { useState, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { ConversationList } from "@/components/inbox/ConversationList"
import { ChatWindow } from "@/components/inbox/ChatWindow"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InboxPage() {
    const { userId, isLoading } = useInstagramSession()
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [selectedRecipientName, setSelectedRecipientName] = useState<string | null>(null)
    const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null)

    useEffect(() => {
        setSelectedConversationId(null)
        setSelectedRecipientName(null)
        setSelectedRecipientId(null)
    }, [userId])

    const handleSelect = (id: string, name: string, recipientId: string) => {
        setSelectedConversationId(id)
        setSelectedRecipientName(name)
        setSelectedRecipientId(recipientId)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
        )
    }

    if (!userId) {
        return null
    }

    return (
        <div className="h-[calc(100vh-3rem)] m-6 rounded-xl overflow-hidden border border-border bg-card flex relative">
            {/* Left Sidebar: Conversation List */}
            <div className={cn(
                "w-full md:w-[360px] flex-shrink-0 border-r border-border bg-card absolute md:static inset-0 z-10 transition-transform duration-200 md:translate-x-0 h-full",
                selectedConversationId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                <ConversationList
                    userId={userId}
                    selectedId={selectedConversationId}
                    onSelect={handleSelect}
                />
            </div>

            {/* Right Main: Chat Window */}
            <div className={cn(
                "flex-1 w-full absolute md:static inset-0 z-20 bg-card transition-transform duration-200 md:translate-x-0 h-full",
                selectedConversationId ? "translate-x-0" : "translate-x-full md:translate-x-0"
            )}>
                <ChatWindow
                    conversationId={selectedConversationId}
                    recipientName={selectedRecipientName}
                    recipientId={selectedRecipientId || undefined}
                    userId={userId}
                    onBack={() => setSelectedConversationId(null)}
                />
            </div>
        </div>
    )
}
