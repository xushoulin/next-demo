/**
 * 八字排盘领域常量 —— 纯数据，无副作用，可被前后端共享。
 */

/** 十天干 */
export const HEAVENLY_STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;

/** 十二地支 */
export const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

/** 五行 */
export const FIVE_ELEMENTS = ["木", "火", "土", "金", "水"] as const;
export type FiveElement = (typeof FIVE_ELEMENTS)[number];

/** 十神 */
export const TEN_GODS = [
  "比肩",
  "劫财",
  "食神",
  "伤官",
  "偏财",
  "正财",
  "七杀",
  "正官",
  "偏印",
  "正印",
] as const;
export type TenGod = (typeof TEN_GODS)[number];

/** 天干五行 */
export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

/** 天干阴阳：true 为阳 */
export const STEM_YANG: Record<HeavenlyStem, boolean> = {
  甲: true,
  乙: false,
  丙: true,
  丁: false,
  戊: true,
  己: false,
  庚: true,
  辛: false,
  壬: true,
  癸: false,
};

/** 地支五行（本气） */
export const BRANCH_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

/**
 * 地支藏干，按「本气 → 中气 → 余气」次序排列，
 * 列表中第一个即该支的本气。
 */
export const BRANCH_HIDDEN_STEMS: Record<EarthlyBranch, HeavenlyStem[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

/** 十二生肖，与年支顺序一致 */
export const ZODIAC = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
] as const;

/** 五行相生：木→火→土→金→水→木 */
export const GENERATES: Record<FiveElement, FiveElement> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

/** 五行相克：木克土、土克水、水克火、火克金、金克木 */
export const OVERCOMES: Record<FiveElement, FiveElement> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

/** 五行对应的展示样式（Tailwind 原子类，供组件直接引用） */
export const ELEMENT_STYLES: Record<
  FiveElement,
  { text: string; chip: string; bar: string }
> = {
  木: {
    text: "text-emerald-300",
    chip: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    bar: "bg-emerald-400",
  },
  火: {
    text: "text-rose-300",
    chip: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    bar: "bg-rose-400",
  },
  土: {
    text: "text-amber-300",
    chip: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    bar: "bg-amber-400",
  },
  金: {
    text: "text-slate-100",
    chip: "border-slate-300/30 bg-slate-400/10 text-slate-100",
    bar: "bg-slate-300",
  },
  水: {
    text: "text-sky-300",
    chip: "border-sky-400/30 bg-sky-500/10 text-sky-200",
    bar: "bg-sky-400",
  },
};
