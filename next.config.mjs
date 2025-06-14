/** @type {import('next').NextConfig} */
const nextConfig = {
    output : 'standalone',
    reactStrictMode : true,
    eslint : {
        ignoreDuringBuilds : true
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
    minimumCacheTTL: 60,
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
            },
            {
                hostname: 'upload.wikimedia.org',
            },
            {
                hostname : "www.ourastore.com"
            }
        ]
    }
};

export default nextConfig;
