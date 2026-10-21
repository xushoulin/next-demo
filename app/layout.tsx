import type { Metadata } from "next";
import "./globals.css";
import AdsterraScripts from "./components/AdsterraScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://next-demo-nu-two.vercel.app"),
  title: {
    default: "砚知 AI · 通识学习与写作助手",
    template: "%s · 砚知 AI",
  },
  description:
    "砚知 AI 是一个通识学习与写作辅助助手，提供知识问答、写作助手与学习方法三大模块，帮助你更好地学习、理解与表达。所有内容仅供学习参考。",
  keywords: [
    "砚知AI",
    "AI学习",
    "知识问答",
    "学习方法",
    "写作助手",
    "通识科普",
    "AI写作",
    "主动回忆",
    "费曼技巧",
  ],
  authors: [{ name: "砚知 AI" }],
  category: "education",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "砚知 AI",
    title: "砚知 AI · 通识学习与写作助手",
    description:
      "通识学习与写作辅助助手：知识问答、写作助手与学习方法，帮你更好地学习、理解与表达。",
  },
  twitter: {
    card: "summary_large_image",
    title: "砚知 AI · 通识学习与写作助手",
    description:
      "通识学习与写作辅助助手：知识问答、写作助手与学习方法，帮你更好地学习、理解与表达。",
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
      <body className="min-h-screen antialiased">
        {children}
        <AdsterraScripts />
      </body>
    </html>
  );
}
