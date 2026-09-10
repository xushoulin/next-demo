import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Demo · 待办事项",
  description: "一个用 Next.js App Router 写的待办事项小 demo",
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
          crossorigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
