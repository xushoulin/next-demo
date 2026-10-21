import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "产品",
    links: [
      { href: "/chat", label: "开始对话" },
      { href: "/guides", label: "使用指南" },
    ],
  },
  {
    title: "关于",
    links: [
      { href: "/about", label: "关于我们" },
      { href: "/contact", label: "联系我们" },
    ],
  },
  {
    title: "条款",
    links: [
      { href: "/privacy", label: "隐私政策" },
      { href: "/terms", label: "服务条款" },
      { href: "/about#disclaimer", label: "免责声明" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-base font-semibold text-amber-100">
            <span aria-hidden="true">🌙</span>
            <span>砚知 AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
            通识学习与写作辅助助手，陪你厘清知识、打磨文字、建立学习习惯。
          </p>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-slate-200">
              {section.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-amber-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} 砚知 AI. 保留所有权利。</p>
          <p className="leading-relaxed">
            本站为通识学习与写作辅助工具，内容仅供学习参考，不构成任何医疗、法律或专业建议。
          </p>
        </div>
      </div>
    </footer>
  );
}
