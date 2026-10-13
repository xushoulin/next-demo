import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide, type Block } from "@/lib/content/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "未找到文章" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

/** 把 **加粗** 标记转换为 React 节点 */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-amber-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{renderInline(block.text)}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <blockquote>{renderInline(block.text)}</blockquote>
      );
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav className="text-sm text-slate-500">
        <Link href="/guides" className="hover:text-amber-100">
          知识专栏
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-400">{guide.category}</span>
      </nav>

      <header className="mt-4 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-white/5 px-3 py-1 text-amber-100/90 ring-1 ring-white/10">
            {guide.category}
          </span>
          <span className="text-slate-500">{guide.readingTime}</span>
          <span className="text-slate-500">更新于 {guide.updated}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          {guide.description}
        </p>
      </header>

      <article className="prose-article mt-8">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </section>
        ))}
      </article>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h3 className="text-lg font-semibold text-amber-100">
          想把知识用起来？
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          把你的疑问或草稿讲给砚知 AI 听，它会给出结构化的解答与可落地的建议。
        </p>
        <Link
          href="/chat"
          className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          立即开始对话 →
        </Link>
      </div>
    </div>
  );
}
