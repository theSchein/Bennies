/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'arweave.net', 'firebasestorage.googleapis.com', 'www.larvalabs.com', 'live---metadata-5covpqijaa-uc.a.run.app'],
  },
}

module.exports = nextConfig
