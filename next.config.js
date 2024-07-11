await import("./src/env.js");

// @ts-check
const { withNextVideo } = await import("next-video/process");
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */

  images: {
    domains: [
      "logo--generator.s3.ap-northeast-2.amazonaws.com",
      "img.clerk.com",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextVideo(nextConfig);
