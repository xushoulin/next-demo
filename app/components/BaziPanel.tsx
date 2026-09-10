"use client";

import { useMemo, useState } from "react";
import type { BaziAgentMeta } from "@/lib/agents";
import { buildBaziChart, daysInMonth, hourToBranch } from "@/lib/bazi";
import BaziResult from "./BaziResult";

type BaziPanelProps = {
  agent: BaziAgentMeta;
  /** 是否为当前展示的面板 */
  active: boolean;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, index) => CURRENT_YEAR - index,
);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const HOURS = Array.from({ length: 24 }, (_, index) => index);

const SELECT_CLASS =
  "w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 pr-8 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:bg-slate-950/80";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-400">{label}</span>
      <span className="relative block">
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
        >
          ▾
        </span>
      </span>
    </label>
  );
}

/**
 * 八字排盘面板：输入出生年月日时，实时排出四柱、五行与十神。
 * 与对话面板同构（常驻挂载，激活时显示），保证切换 Tab 不丢失输入。
 */
export default function BaziPanel({ agent, active }: BaziPanelProps) {
  const [year, setYear] = useState(1995);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(12);

  // 切换年月后若原日期超出当月天数，自动收敛到当月最后一天
  const maxDay = daysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);

  const chart = useMemo(
    () => buildBaziChart({ year, month, day: safeDay, hour }),
    [year, month, safeDay, hour],
  );

  return (
    <section
      id={`panel-${agent.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${agent.id}`}
      aria-hidden={!active}
      className={`absolute inset-0 flex-col ${active ? "flex" : "hidden"}`}
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <header className="animate-fade-up">
            <h2
              className={`text-xl font-bold sm:text-2xl ${agent.theme.title}`}
            >
              {agent.welcomeTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {agent.welcomeText}
            </p>
          </header>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
            <h3 className={`mb-4 text-sm font-semibold ${agent.theme.title}`}>
              输入出生时间（公历）
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="年">
                <select
                  aria-label="出生年份"
                  className={SELECT_CLASS}
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                >
                  {YEARS.map((item) => (
                    <option key={item} value={item}>
                      {item} 年
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="月">
                <select
                  aria-label="出生月份"
                  className={SELECT_CLASS}
                  value={month}
                  onChange={(event) => setMonth(Number(event.target.value))}
                >
                  {MONTHS.map((item) => (
                    <option key={item} value={item}>
                      {item} 月
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="日">
                <select
                  aria-label="出生日期"
                  className={SELECT_CLASS}
                  value={safeDay}
                  onChange={(event) => setDay(Number(event.target.value))}
                >
                  {Array.from({ length: maxDay }, (_, index) => index + 1).map(
                    (item) => (
                      <option key={item} value={item}>
                        {item} 日
                      </option>
                    ),
                  )}
                </select>
              </Field>

              <Field label="时">
                <select
                  aria-label="出生时辰"
                  className={SELECT_CLASS}
                  value={hour}
                  onChange={(event) => setHour(Number(event.target.value))}
                >
                  {HOURS.map((item) => (
                    <option key={item} value={item}>
                      {String(item).padStart(2, "0")}:00 · {hourToBranch(item)}时
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              八字以立春为岁首、节气划分月份；23:00 之后按次日日柱计算（子时换日）。
            </p>
          </div>

          <div className="mt-6">
            <BaziResult agent={agent} chart={chart} />
          </div>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-600">
            {agent.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
