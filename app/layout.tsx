import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://next-demo-nu-two.vercel.app"),
  title: {
    default: "尚美智宿 · 酒店智能服务助手",
    template: "%s · 尚美智宿",
  },
  description:
    "尚美智宿是酒店智能服务助手，提供智能礼宾、预订指引与会员服务三大模块，帮助你更轻松地完成从预订到入住的每一步。回答内容仅供参考，价格与房态以官方渠道为准。",
  keywords: [
    "尚美智宿",
    "酒店AI助手",
    "智能礼宾",
    "预订助手",
    "会员服务",
    "房型推荐",
    "入住指南",
  ],
  authors: [{ name: "尚美智宿" }],
  category: "travel",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "尚美智宿",
    title: "尚美智宿 · 酒店智能服务助手",
    description:
      "酒店智能服务助手：智能礼宾、预订指引与会员服务，让每一次入住更省心。",
  },
  twitter: {
    card: "summary_large_image",
    title: "尚美智宿 · 酒店智能服务助手",
    description:
      "酒店智能服务助手：智能礼宾、预订指引与会员服务，让每一次入住更省心。",
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
