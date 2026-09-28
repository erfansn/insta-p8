import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "InstaAuto - Instagram Automation",
  description: "Auto-reply to comments, DMs, and stories with keyword triggers.",
  openGraph: {
    title: "InstaAuto - Instagram Automation",
    description: "Auto-reply to comments, DMs, and stories with keyword triggers.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

const themeBootstrap = `
(function() {
  try {
    var stored = window.localStorage.getItem('insta-p8-theme');
    var theme = (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'dark';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    var root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    root.dataset.theme = resolved;
  } catch (_) { /* noop */ }
})();
`.trim()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-hydration theme bootstrap — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
