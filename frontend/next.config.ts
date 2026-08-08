import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Locally-served avatar uploads from the FastAPI backend — see
    // backend/app/api/users.py. Swap/extend once real object storage
    // (plan.md's S3-compatible flow) is wired up.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    // The backend is always our own localhost service in dev, never
    // user-controlled input, so the SSRF guard against private IPs doesn't
    // apply here — safe to allow. Revisit once the backend has a real
    // public hostname (production / S3).
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
