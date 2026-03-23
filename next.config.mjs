/** @type {import('next').NextConfig} */
const nextConfig = {
  /** HTML은 항상 최신 버전 확인, SW 파일도 캐시하지 않음 */
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/((?!_next|icons|manifest).*)",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
