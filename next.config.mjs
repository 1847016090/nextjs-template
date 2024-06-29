/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs-1257212764.cos.ap-chengdu.myqcloud.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
