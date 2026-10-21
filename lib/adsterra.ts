/**
 * Adsterra 广告配置。
 * 所有开关通过环境变量控制：未配置时组件不渲染，本地开发与 Vercel 部署零影响。
 *
 * 配置方式（Vercel 项目 Settings → Environment Variables，或本地 .env.local）：
 * - NEXT_PUBLIC_ADSTERRA_BANNER_SRC   Banner 广告 invoke.js 地址，如 //www.xxx.com/123/invoke.js
 * - NEXT_PUBLIC_ADSTERRA_BANNER_KEY   Banner 广告位 key（atOptions.key）
 * - NEXT_PUBLIC_ADSTERRA_BANNER_WIDTH  默认 300
 * - NEXT_PUBLIC_ADSTERRA_BANNER_HEIGHT 默认 250
 * - NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC Social Bar 脚本地址（整站挂载，可选）
 * - NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC  Popunder 脚本地址（整站挂载，可选，慎用）
 */

function env(key: string): string | undefined {
  const v = process.env[key];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export const adsterra = {
  banner: {
    src: env("NEXT_PUBLIC_ADSTERRA_BANNER_SRC"),
    key: env("NEXT_PUBLIC_ADSTERRA_BANNER_KEY"),
    width: Number(env("NEXT_PUBLIC_ADSTERRA_BANNER_WIDTH") ?? 300),
    height: Number(env("NEXT_PUBLIC_ADSTERRA_BANNER_HEIGHT") ?? 250),
  },
  socialBarSrc: env("NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC"),
  popunderSrc: env("NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC"),
};
