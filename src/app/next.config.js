/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: "https",
    hostname: "drive.google.com",
  },
];

function addHostFromUrl(urlString) {
  if (!urlString) return;

  try {
    const url = new URL(urlString);
    if (!url.hostname) return;

    const alreadyExists = remotePatterns.some(
      (pattern) => pattern.hostname === url.hostname,
    );

    if (!alreadyExists) {
      remotePatterns.push({
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
      });
    }
  } catch {
    // abaikan env yang tidak valid
  }
}

addHostFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
addHostFromUrl(process.env.NEXT_PUBLIC_SITE_URL);

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
