import createMDX from '@next/mdx'

const baselineSecurityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
    { key: 'X-Frame-Options', value: 'DENY' },
]

const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: baselineSecurityHeaders,
            },
        ]
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'raw.githubusercontent.com'},
            {protocol: 'https', hostname: 'user-images.githubusercontent.com'},
            {protocol: 'https', hostname: 'github.com'},
            {protocol: "https", hostname: "images.githubusercontent.com"},
            {protocol: "https", hostname: "githubusercontent.com"},
            {protocol: "https", hostname: "images.unsplash.com"},
            {protocol: "https", hostname: "i.imgur.com"},
            {protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '**',},
        ],
    },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
