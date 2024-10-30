/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
        // HomePage redirect
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
