import { adsterra } from "@/lib/adsterra";

/**
 * Adsterra Banner 广告位。
 *
 * Adsterra 的 banner 代码依赖 document.write，在 Next.js 的 SPA 中直接执行会清空页面，
 * 因此这里把广告代码装进同源 srcdoc iframe 里渲染——document.write 只作用于 iframe 内部。
 * 未配置环境变量时返回 null，不影响任何现有页面。
 */
export default function AdsterraBanner({
  className = "",
}: {
  className?: string;
}) {
  const { src, key, width, height } = adsterra.banner;
  if (!src || !key) return null;

  const srcdoc = [
    "<!DOCTYPE html>",
    '<html lang="zh-CN">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<style>",
    "html,body{margin:0;padding:0;background:transparent;overflow:hidden}",
    "</style>",
    "</head>",
    "<body>",
    '<script type="text/javascript">',
    `var atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};`,
    "</script>",
    `<script type="text/javascript" src="${src}"></scr` + "ipt>",
    "</body>",
    "</html>",
  ].join("\n");

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span className="text-xs text-slate-500">广告</span>
      <iframe
        title="赞助商广告"
        srcDoc={srcdoc}
        width={width}
        height={height}
        scrolling="no"
        loading="lazy"
        style={{ border: 0, maxWidth: "100%" }}
      />
    </div>
  );
}
