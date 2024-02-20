/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'arweave.net', 'firebasestorage.googleapis.com', 'www.larvalabs.com'],
  },
}

module.exports = nextConfig
