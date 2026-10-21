import type { Metadata } from "next";
import { GUIDES } from "@/lib/content/guides";
import GuidesExplorer from "../../components/GuidesExplorer";
import AdsterraBanner from "../../components/AdsterraBanner";

export const metadata: Metadata = {
  title: "知识专栏",
  description:
    "砚知 AI 知识专栏：从学习方法入门、主动回忆与间隔重复技巧，到通识科普与写作方法，帮助你更好地学习、理解与表达。",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">使用指南</p>
        <h1 className="mt-2 text-3xl font-bold text-white">把工具用得更得心应手</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          这里收录了学习方法、通识科普与写作技巧三个方向的参考文章，
          帮你建立基础框架，也分享一些和砚知 AI 对话的小技巧。
          每篇文章都给出可操作的步骤，并标注知识的适用边界。内容持续更新中。
        </p>
      </header>

      <GuidesExplorer guides={GUIDES} />

      <AdsterraBanner className="mt-12" />
    </div>
  );
}
