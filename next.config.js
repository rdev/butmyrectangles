/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
