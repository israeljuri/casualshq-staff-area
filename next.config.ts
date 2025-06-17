import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

//  This makes sure that the Next.js dev server can optimally integrate with the open-next cloudflare adapter and it is necessary for using bindings during local development.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
