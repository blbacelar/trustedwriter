/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "trusted-writer.vercel.app",
        process.env.NEXT_PUBLIC_APP_URL,
      ].filter(Boolean),
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
      type: "javascript/auto",
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
      net: false,
      tls: false,
    };

    return config;
  },
  staticPageGenerationTimeout: 120,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
