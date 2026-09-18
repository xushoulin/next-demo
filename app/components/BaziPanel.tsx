"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BaziAgentMeta } from "@/lib/agents";
import { buildBaziChart, daysInMonth, hourToBranch } from "@/lib/bazi";
import type { BaziRecord } from "@/lib/db/types";
import BaziResult from "./BaziResult";

type BaziPanelProps = {
  agent: BaziAgentMeta;
  /** 是否为当前展示的面板 */
  active: boolean;
  /** 当前登录用户名（用于把排盘保存到数据库） */
  username: string;
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
export default function BaziPanel({ agent, active, username }: BaziPanelProps) {
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

  const [records, setRecords] = useState<BaziRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const loadRecords = useCallback(async () => {
    try {
      const res = await fetch("/api/bazi");
      if (res.ok) {
        const data = (await res.json()) as { records: BaziRecord[] };
        setRecords(data.records ?? []);
      }
    } catch {
      // 数据库暂不可用时忽略
    }
  }, []);

  // 登录后加载历史排盘
  useEffect(() => {
    if (username) void loadRecords();
  }, [username, loadRecords]);

  const saveChart = useCallback(async () => {
    if (!username) return;
    setSaving(true);
    try {
      const res = await fetch("/api/bazi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { year, month, day: safeDay, hour },
          chart,
        }),
      });
      if (res.ok) {
        setSavedAt(Date.now());
        void loadRecords();
      }
    } catch {
      // 忽略保存失败
    } finally {
      setSaving(false);
    }
  }, [username, year, month, safeDay, hour, chart, loadRecords]);

  const loadRecord = useCallback((record: BaziRecord) => {
    setYear(record.year);
    setMonth(record.month);
    setDay(record.day);
    setHour(record.hour);
  }, []);

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

          {username && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className={`text-sm font-semibold ${agent.theme.title}`}>
                  我的排盘记录
                </h3>
                <div className="flex items-center gap-2">
                  {savedAt && (
                    <span className="text-[11px] text-emerald-300">
                      已保存到本地数据库 ✓
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void saveChart()}
                    disabled={saving}
                    className="rounded-lg bg-gradient-to-br from-amber-500 to-purple-700 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-950/40 transition hover:from-amber-400 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "保存中…" : "保存此排盘"}
                  </button>
                </div>
              </div>

              {records.length === 0 ? (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  暂无记录，调整出生时间后点击「保存此排盘」即可留档。
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {records.map((record) => (
                    <li key={record.id}>
                      <button
                        type="button"
                        onClick={() => loadRecord(record)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2.5 text-left transition hover:border-amber-400/50"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm text-slate-100">
                            {record.year} 年 {record.month} 月 {record.day} 日{" "}
                            {String(record.hour).padStart(2, "0")}:00
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            日主 {record.chart.dayMaster.stem}
                            {record.chart.dayMaster.element}
                            {record.chart.missing.length > 0
                              ? ` · 缺 ${record.chart.missing.join("")}`
                              : " · 五行俱全"}
                          </span>
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-500">
                          载入 →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-600">
            {agent.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
