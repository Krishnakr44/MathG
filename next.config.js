/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => 'mathg-build',
};

module.exports = nextConfig;
