/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "ipfs.io",
            "arweave.net",
            "firebasestorage.googleapis.com",
            "www.larvalabs.com",
            "live---metadata-5covpqijaa-uc.a.run.app",
            "shuk.nyc3.digitaloceanspaces.com",
            "shuk.nyc3.cdn.digitaloceanspaces.com",
            "runi.splinterlands.com",
            "https://media-proxy.artblocks.io",
        ],
    },
};

module.exports = nextConfig;
