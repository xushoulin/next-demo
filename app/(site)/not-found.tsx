import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="text-6xl">📖</p>
      <h1 className="mt-6 text-3xl font-bold text-white">这一页暂时寻不到踪迹</h1>
      <p className="mt-4 max-w-md text-slate-400">
        你访问的页面可能已被移动或从未存在。回到首页，或去知识专栏看看吧。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          返回首页
        </Link>
        <Link
          href="/guides"
          className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          浏览知识专栏
        </Link>
      </div>
    </div>
  );
}
