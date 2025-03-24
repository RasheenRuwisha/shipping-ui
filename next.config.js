module.exports = {
  webpack5: true,
  reactStrictMode: true,
  i18n: {
    locales: ["en", "es", "fr"],
    localeDetection: true,
    defaultLocale: "en",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "yzvovutt5syi9lsy.public.blob.vercel-storage.com",
      },
    ],
  },
};
