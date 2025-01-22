/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
}

module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   serverExternalPackages: ['pdf-parse'], // Updated key
// };

// module.exports = nextConfig;
