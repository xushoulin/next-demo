"use client";

import type { BaziAgentMeta } from "@/lib/agents";
import { ELEMENT_STYLES, type BaziChart } from "@/lib/bazi";

type BaziResultProps = {
  agent: BaziAgentMeta;
  chart: BaziChart;
};

function Stat({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-3 text-center">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div
        className={`mt-1 text-lg font-semibold ${valueClass ?? "text-slate-100"}`}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
      <h3 className={`mb-4 text-sm font-semibold ${accent}`}>{title}</h3>
      {children}
    </section>
  );
}

/** 八字排盘结果展示：概览、四柱、五行分布、十神分布 */
export default function BaziResult({ agent, chart }: BaziResultProps) {
  const accent = agent.theme.title;
  const { dayMaster } = chart;
  const yinYang = dayMaster.yang ? "阳" : "阴";

  return (
    <div className="space-y-4 animate-fade-up">
      <Section title="命盘概览" accent={accent}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="生肖" value={chart.zodiac} />
          <Stat
            label="日主（日元）"
            value={`${dayMaster.stem}${dayMaster.element}`}
            sub={`${yinYang}${dayMaster.element}`}
            valueClass={ELEMENT_STYLES[dayMaster.element].text}
          />
          <Stat
            label="出生时辰"
            value={`${chart.hourBranch}时`}
            sub={`${String(chart.input.hour).padStart(2, "0")}:00`}
          />
          <Stat
            label="五行缺失"
            value={chart.missing.length > 0 ? chart.missing.join("") : "俱全"}
            sub={chart.missing.length > 0 ? "结合大运综合看" : "分布相对均衡"}
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          公历 {chart.input.year} 年 {chart.input.month} 月 {chart.input.day} 日{" "}
          {chart.input.hour} 时（北京时间）
        </p>
      </Section>

      <Section title="四柱排盘" accent={accent}>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {chart.pillars.map((pillar) => {
            const isDayMaster = pillar.position === "日柱";

            return (
              <div
                key={pillar.position}
                className={`flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/30 p-2.5 sm:p-4 ${
                  isDayMaster ? "ring-1 ring-amber-400/40" : ""
                }`}
              >
                <span className="text-[11px] text-slate-500 sm:text-xs">
                  {pillar.position}
                </span>

                <div className="flex flex-col items-center">
                  <span
                    className={`text-3xl font-semibold leading-none sm:text-4xl ${ELEMENT_STYLES[pillar.stemElement].text}`}
                  >
                    {pillar.stem}
                  </span>
                  <span
                    className={`mt-1 text-3xl font-semibold leading-none sm:text-4xl ${ELEMENT_STYLES[pillar.branchElement].text}`}
                  >
                    {pillar.branch}
                  </span>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 sm:text-xs">
                  {pillar.tenGod}
                </span>

                <div className="w-full border-t border-white/10 pt-2">
                  <div className="mb-1.5 text-center text-[10px] tracking-wider text-slate-500">
                    藏干
                  </div>
                  <ul className="space-y-1.5">
                    {pillar.hiddenStems.map((hidden) => (
                      <li
                        key={hidden.stem}
                        className="flex flex-col items-center leading-tight"
                      >
                        <span
                          className={`text-[11px] sm:text-xs ${ELEMENT_STYLES[hidden.element].text}`}
                        >
                          {hidden.stem}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {hidden.tenGod}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          天干与地支的颜色对应五行；日柱天干即「日主」，代表命主自身。
        </p>
      </Section>

      <Section title="五行分布" accent={accent}>
        <div className="space-y-3">
          {chart.elements.map(({ element, count }) => (
            <div key={element} className="flex items-center gap-3">
              <span
                className={`w-5 shrink-0 text-center text-sm font-medium ${ELEMENT_STYLES[element].text}`}
              >
                {element}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out ${ELEMENT_STYLES[element].bar}`}
                  style={{ width: `${(count / 8) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-slate-400">
                {count} / 8
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          {chart.missing.length > 0 ? (
            <>
              八字中未见{" "}
              <span className="text-slate-200">
                {chart.missing.join("、")}
              </span>
              ，五行有所偏缺，宜结合大运流年综合看待。
            </>
          ) : (
            "五行俱全，分布较为均衡。"
          )}
        </p>
      </Section>

      <Section title="十神分布" accent={accent}>
        <div className="flex flex-wrap gap-2">
          {chart.tenGodStats.map(({ tenGod, count }) => (
            <span
              key={tenGod}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              {tenGod}
              <span className="text-slate-500">×{count}</span>
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          十神以日主为基准，统计四柱天干与地支藏干。
        </p>
      </Section>
    </div>
  );
}
