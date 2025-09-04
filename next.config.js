// next.config.js - FINAL CORRECTED VERSION

/** @type {import('next').NextConfig} */
const nextConfig = {
    // --- 'rewrites' SECTION REMOVED - IT IS NO LONGER NEEDED ---

    // --- YOUR EXISTING CONFIGS (UNCHANGED) ---
    eslint: {
        ignoreDuringBuilds: true,
    },
    devIndicators: {
        allowedDevOrigins: [
            'http://164.92.160.227:3000' 
        ],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '164.92.160.227',
                port: '1337',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.mydreambeauty.net',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
};

module.exports = nextConfig;
