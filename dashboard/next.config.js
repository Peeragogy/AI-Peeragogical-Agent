/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com'],
    },
    experimental: {
        swcMinify: true,
    },
    // Abilita CSS modules globali
    cssModules: true
}