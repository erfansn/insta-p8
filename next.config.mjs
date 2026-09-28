/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // schema.sql is read at runtime by lib/supabase-migrate.ts. Without this
  // entry, the serverless bundle for the Vercel function that imports
  // ensureSchema() will not include schema.sql, and the migration runner
  // will log "schema.sql not found" on every cold start.
  // Vercel bundles follow the application root by default; we extend
  // `outputFileTracingIncludes` so the file explicitly survives the trace.
  outputFileTracingIncludes: {
    "**/*": ["./schema.sql"],
  },
}

export default nextConfig
