"use client";

import Script from "next/script";
import { adsterra } from "@/lib/adsterra";

/**
 * Adsterra 整站脚本挂载点（Social Bar / Popunder）。
 * 这两个格式的代码是单个 <script src>，不涉及 document.write，
 * 用 next/script 的 afterInteractive 策略加载即可。
 * 未配置环境变量时返回 null。
 *
 * 注意：Popunder 属侵入式格式，AdSense 复审期间建议先不开。
 */
export default function AdsterraScripts() {
  return (
    <>
      {adsterra.socialBarSrc && (
        <Script
          id="adsterra-socialbar"
          src={adsterra.socialBarSrc}
          strategy="afterInteractive"
        />
      )}
      {adsterra.popunderSrc && (
        <Script
          id="adsterra-popunder"
          src={adsterra.popunderSrc}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
