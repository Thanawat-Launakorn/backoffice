/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'] // <=== Domain name
    },
    env: {
        ENDPOINT: process.env.ENDPOINT,
    }
};

export default nextConfig;
