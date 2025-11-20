import createMDX from '@next/mdx'

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'raw.githubusercontent.com' },
            { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
            { protocol: 'https', hostname: 'github.com' },
            { protocol: "https", hostname: "images.githubusercontent.com" },
            { protocol: "https", hostname: "githubusercontent.com" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "i.imgur.com" }
        ],
    },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
