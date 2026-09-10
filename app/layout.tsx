import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "玄机 AI · 周公解梦 & 风水先生",
  description:
    "融合传统典籍与现代心理学的 AI 助手：周公解梦与风水先生双模块，基于阿里云百炼大模型。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2622415797490761"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
