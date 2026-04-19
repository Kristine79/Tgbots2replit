/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  outputFileTracingExcludes: {
    "*": ["./artifacts/**/*", "./lib/api-client-react/**/*", "./lib/integrations/**/*"],
  },
}

export default nextConfig
