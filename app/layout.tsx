import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 周公解梦 · 梦境解读助手",
  description:
    "融合《周公解梦》传统典籍与现代心理学的 AI 梦境解读助手，基于阿里云百炼大模型。",
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
