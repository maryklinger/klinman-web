/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esta opción ayuda a resolver los módulos cuando usas Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
  },
};

export default nextConfig;