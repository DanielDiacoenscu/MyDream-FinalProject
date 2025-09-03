// next.config.js - CORRECTED

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        allowedDevOrigins: [
            'http://164.92.160.227:3000' 
        ],
    },
    images: {
        remotePatterns: [
            // Your existing configuration for the local Strapi IP (UNCHANGED)
            {
                protocol: 'http',
                hostname: '164.92.160.227',
                port: '1337',
                pathname: '/uploads/**',
            },
            // Your existing configuration for placeholders (UNCHANGED)
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            // --- THIS IS THE NECESSARY ADDITION ---
            // This whitelists your live Strapi API domain, which is required
            // for the search results to load their images.
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
