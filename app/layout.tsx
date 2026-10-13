import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://next-demo-nu-two.vercel.app"),
  title: {
    default: "玄机 AI · 周公解梦 & 风水先生",
    template: "%s · 玄机 AI",
  },
  description:
    "玄机 AI 是一个融合传统典籍与现代心理学的智能助手，提供周公解梦、风水布局与八字排盘三大模块，帮助你更好理解梦境、环境与自我。所有解读均基于公开文化与心理学知识，仅供娱乐与自我觉察参考。",
  keywords: [
    "周公解梦",
    "AI解梦",
    "风水",
    "家居风水",
    "八字排盘",
    "梦境解读",
    "心理分析",
    "玄机AI",
  ],
  authors: [{ name: "玄机 AI" }],
  category: "reference",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "玄机 AI",
    title: "玄机 AI · 周公解梦 & 风水先生",
    description:
      "融合传统典籍与现代心理学的智能助手：周公解梦、风水布局与八字排盘。",
  },
  twitter: {
    card: "summary_large_image",
    title: "玄机 AI · 周公解梦 & 风水先生",
    description:
      "融合传统典籍与现代心理学的智能助手：周公解梦、风水布局与八字排盘。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
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
