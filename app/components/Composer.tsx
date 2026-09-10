"use client";

import { useEffect, useRef } from "react";
import type { ChatAgentMeta } from "@/lib/agents";

const MAX_HEIGHT = 160;
const MIN_HEIGHT = 24;

type ComposerProps = {
  agent: ChatAgentMeta;
  /** 所在面板是否可见：隐藏时无法测量高度，必须避免写入错误值 */
  active: boolean;
  value: string;
  isBusy: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
};

/** 输入区：自动增高、Enter 发送、Shift+Enter 换行、支持中断生成 */
export default function Composer({
  agent,
  active,
  value,
  isBusy,
  onChange,
  onSubmit,
  onStop,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /** 是否处于输入法组合态（拼音 / 五笔等选词过程中） */
  const composingRef = useRef(false);
  const fieldId = `composer-${agent.id}`;

  // 随内容自动增高，超过上限后内部滚动。
  //
  // 关键修复：元素处于 display:none 时 scrollHeight 恒为 0，
  // 若此时把 0px 写入内联样式，输入框会被永久压扁——后续面板显示时
  // 因 value 未变化，effect 也不会重跑，导致该模块彻底无法输入。
  // 因此：不可见时跳过测量；`active` 变化（面板切换）时重新测量。
  useEffect(() => {
    const el = textareaRef.current;
    // 组合态下不改动样式，避免打断输入法候选词窗口
    if (!el || !active || composingRef.current) return;

    el.style.height = "auto";
    const measured = Math.min(
      Math.max(el.scrollHeight, MIN_HEIGHT),
      MAX_HEIGHT,
    );
    el.style.height = `${measured}px`;
  }, [value, active]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 输入法组合态下按 Enter 是「确认候选词」，必须放行：
    // 若在此拦截，既会打断选词，又会把未完成的拼音或半截文本发送出去，
    // 导致模型收到残缺内容、回答牛头不对马嘴。
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative z-10 shrink-0 border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-end gap-3 px-4 py-4">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-white/25">
          <label htmlFor={fieldId} className="sr-only">
            {`向${agent.name}提问`}
          </label>
          <textarea
            id={fieldId}
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={() => {
              composingRef.current = false;
            }}
            placeholder={`${agent.inputPlaceholder}（Enter 发送，Shift+Enter 换行）`}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none"
          />
        </div>

        {isBusy ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/20"
          >
            停止
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim()}
            className={`rounded-2xl bg-gradient-to-br px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition disabled:cursor-not-allowed disabled:opacity-40 ${agent.theme.action} ${agent.theme.actionHover}`}
          >
            发送
          </button>
        )}
      </div>

      <p className="pb-3 text-center text-[11px] text-slate-600">
        {agent.disclaimer}
      </p>
    </div>
  );
}
