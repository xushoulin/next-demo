"use client";

import React from "react";
import type { AgentTheme } from "@/lib/agents";

/**
 * 轻量级 Markdown 渲染器：
 * 支持标题、加粗、斜体、行内代码、代码块、有序/无序列表、引用、分割线。
 * 无第三方依赖，专为大模型流式文本的实时渲染设计；配色由角色主题注入。
 */

type MarkdownProps = {
  content: string;
  theme: AgentTheme;
};

function renderInline(
  text: string,
  keyPrefix: string,
  theme: AgentTheme,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${index}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className={`font-semibold ${theme.strong}`}>
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className={`rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] ${theme.code}`}
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className={`italic ${theme.code}`}>
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = match.index + token.length;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

const HEADING_SIZES = [
  "text-xl font-bold",
  "text-lg font-semibold",
  "text-base font-semibold",
  "text-sm font-semibold",
];

export default function Markdown({ content, theme }: MarkdownProps) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过收尾的 ```
      blocks.push(
        <pre
          key={`block-${key++}`}
          className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm"
        >
          <code className={`font-mono ${theme.code}`}>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // 标题
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push(
        <p
          key={`h-${key++}`}
          className={`mb-2 mt-4 first:mt-0 ${HEADING_SIZES[level - 1]} ${theme.heading}`}
        >
          {renderInline(heading[2], `h-${key}`, theme)}
        </p>,
      );
      i += 1;
      continue;
    }

    // 分割线
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${key++}`} className="my-4 border-white/10" />);
      i += 1;
      continue;
    }

    // 引用
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${key++}`}
          className={`my-3 border-l-2 bg-white/5 py-2 pl-4 text-sm ${theme.quote}`}
        >
          {quote.map((item, itemIndex) => (
            <p key={itemIndex}>{renderInline(item, `q-${key}-${itemIndex}`, theme)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${key++}`} className="my-2 space-y-1.5 pl-1">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-2 text-sm leading-relaxed">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.bullet}`}
              />
              <span>{renderInline(item, `ul-${key}-${itemIndex}`, theme)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${key++}`} className="my-2 space-y-1.5 pl-1">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-2 text-sm leading-relaxed">
              <span className={`mt-0.5 font-semibold ${theme.ordinal}`}>
                {itemIndex + 1}.
              </span>
              <span>{renderInline(item, `ol-${key}-${itemIndex}`, theme)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i += 1;
      continue;
    }

    // 普通段落
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i]) &&
      !/^#{1,4}\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${key++}`} className="my-2 text-sm leading-relaxed first:mt-0">
        {renderInline(paragraph.join("\n"), `p-${key}`, theme)}
      </p>,
    );
  }

  return <div className="text-slate-100">{blocks}</div>;
}
