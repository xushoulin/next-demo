/**
 * 八字排盘核心算法（纯函数，无副作用）。
 *
 * 采用传统干支历法：
 * - 年柱以「立春」为岁首，而非公历元旦或农历正月初一；
 * - 月柱以「节」（立春、惊蛰、清明……小寒）划分，而非公历月份；
 * - 日柱按儒略日数推算干支；
 * - 时柱由日干经「五鼠遁」推得，23:00 之后按次日日柱计算（子时换日）。
 *
 * 节气位置由太阳视黄经推算（低精度算法，误差约 0.01°，足以判定所属日）。
 * 结果供文化研究与自我认识参考，不作宿命论断。
 */

import {
  BRANCH_ELEMENT,
  BRANCH_HIDDEN_STEMS,
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  GENERATES,
  HEAVENLY_STEMS,
  OVERCOMES,
  STEM_ELEMENT,
  STEM_YANG,
  TEN_GODS,
  ZODIAC,
  type EarthlyBranch,
  type FiveElement,
  type HeavenlyStem,
  type TenGod,
} from "./constants";

export * from "./constants";

export type BaziInput = {
  year: number;
  month: number;
  day: number;
  /** 24 小时制小时数 */
  hour: number;
};

export type PillarPosition = "年柱" | "月柱" | "日柱" | "时柱";

export type HiddenStem = {
  stem: HeavenlyStem;
  element: FiveElement;
  tenGod: TenGod;
};

export type Pillar = {
  position: PillarPosition;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: FiveElement;
  branchElement: FiveElement;
  /** 天干相对日主的十神；日柱天干即日主本身 */
  tenGod: TenGod | "日主";
  hiddenStems: HiddenStem[];
};

export type BaziChart = {
  input: BaziInput;
  /** 生肖 */
  zodiac: string;
  /** 出生时辰地支名（如「午」） */
  hourBranch: EarthlyBranch;
  dayMaster: { stem: HeavenlyStem; element: FiveElement; yang: boolean };
  pillars: Pillar[];
  /** 八字（四天干 + 四地支本气）五行计数，合计 8 */
  elements: { element: FiveElement; count: number }[];
  /** 八字中缺失的五行 */
  missing: FiveElement[];
  /** 十神分布（天干与藏干合计） */
  tenGodStats: { tenGod: TenGod; count: number }[];
};

/** 输入时间按北京时间（UTC+8）解读 */
const TZ_OFFSET = 8 / 24;
/** 太阳黄经日均移动量（度 / 日） */
const SUN_MEAN_SPEED = 0.9856474;
/** 立春的太阳黄经（度），即寅月起点 */
const SPRING_BEGINS_LONGITUDE = 315;

/** 角度归一化到 [0, 360) */
function normalizeDegrees(value: number): number {
  const result = value % 360;
  return result < 0 ? result + 360 : result;
}

/** 两角之差归一化到 (-180, 180]，用于牛顿迭代求根 */
function angleDelta(target: number, actual: number): number {
  let delta = actual - target;
  while (delta > 180) delta -= 360;
  while (delta <= -180) delta += 360;
  return delta;
}

/** 公历（含时刻）转儒略日，采用格里高利历公式 */
function toJulianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5 +
    hour / 24
  );
}

/** 公历整日的儒略日数（JDN），用于推算日柱干支 */
function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** 太阳视黄经（度），低精度算法，误差约 0.01° */
function sunLongitude(julianDayUT: number): number {
  const n = julianDayUT - 2451545.0;
  const meanLongitude = 280.46 + SUN_MEAN_SPEED * n;
  const meanAnomaly = ((357.528 + 0.9856003 * n) * Math.PI) / 180;
  return normalizeDegrees(
    meanLongitude +
      1.915 * Math.sin(meanAnomaly) +
      0.02 * Math.sin(2 * meanAnomaly),
  );
}

/** 求某年某个节气（指定太阳黄经）的儒略日（本地时标） */
function solarTermJulianDay(
  year: number,
  targetLongitude: number,
  approxMonth: number,
  approxDay: number,
): number {
  let julianDayUT =
    toJulianDay(year, approxMonth, approxDay, 12) - TZ_OFFSET;
  for (let i = 0; i < 6; i += 1) {
    const delta = angleDelta(targetLongitude, sunLongitude(julianDayUT));
    julianDayUT -= delta / SUN_MEAN_SPEED;
  }
  return julianDayUT + TZ_OFFSET;
}

/** 由日主与目标天干推十神 */
export function getTenGod(
  dayMaster: HeavenlyStem,
  target: HeavenlyStem,
): TenGod {
  const dayElement = STEM_ELEMENT[dayMaster];
  const targetElement = STEM_ELEMENT[target];
  const sameYinYang = STEM_YANG[dayMaster] === STEM_YANG[target];

  if (dayElement === targetElement) {
    return sameYinYang ? "比肩" : "劫财";
  }
  if (GENERATES[dayElement] === targetElement) {
    return sameYinYang ? "食神" : "伤官";
  }
  if (OVERCOMES[dayElement] === targetElement) {
    return sameYinYang ? "偏财" : "正财";
  }
  if (OVERCOMES[targetElement] === dayElement) {
    return sameYinYang ? "七杀" : "正官";
  }
  return sameYinYang ? "偏印" : "正印";
}

/** 由小时数取时辰地支下标：23:00–00:59 为子时 */
export function hourToBranchIndex(hour: number): number {
  return Math.floor((hour + 1) / 2) % 12;
}

/** 由小时数取时辰地支名 */
export function hourToBranch(hour: number): EarthlyBranch {
  return EARTHLY_BRANCHES[hourToBranchIndex(hour)];
}

/** 由公历年月推该月天数（处理闰年） */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function buildPillar(
  position: PillarPosition,
  stem: HeavenlyStem,
  branch: EarthlyBranch,
  dayMaster: HeavenlyStem,
): Pillar {
  return {
    position,
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    tenGod: position === "日柱" ? "日主" : getTenGod(dayMaster, stem),
    hiddenStems: BRANCH_HIDDEN_STEMS[branch].map((hidden) => ({
      stem: hidden,
      element: STEM_ELEMENT[hidden],
      tenGod: getTenGod(dayMaster, hidden),
    })),
  };
}

/** 依据出生年月日时排出完整八字命盘 */
export function buildBaziChart(input: BaziInput): BaziChart {
  const { year, month, day, hour } = input;
  const localJulianDay = toJulianDay(year, month, day, hour);

  // 年柱：以立春（太阳黄经 315°）为岁首
  const springBegins = solarTermJulianDay(
    year,
    SPRING_BEGINS_LONGITUDE,
    2,
    4,
  );
  const ganzhiYear = localJulianDay < springBegins ? year - 1 : year;
  const yearIndex = (((ganzhiYear - 4) % 60) + 60) % 60;

  // 月柱：按太阳黄经落入的 30° 扇区定月支（立春所在扇区为寅月）
  const longitude = sunLongitude(localJulianDay - TZ_OFFSET);
  const sector = Math.floor(
    normalizeDegrees(longitude - SPRING_BEGINS_LONGITUDE) / 30,
  );
  const monthBranchIndex = (2 + sector) % 12;

  // 日柱：儒略日数推算干支，23:00 后进位至次日（子时换日）
  const dayJulianNumber =
    julianDayNumber(year, month, day) + (hour === 23 ? 1 : 0);
  const dayIndex =
    ((((dayJulianNumber + 49) % 60) + 60) % 60);

  // 时柱：五鼠遁，由日干起子时
  const hourBranchIndex = hourToBranchIndex(hour);

  const yearStemIndex = yearIndex % 10;
  const monthStemIndex =
    ((yearStemIndex % 5) * 2 + 2 + ((monthBranchIndex - 2 + 12) % 12)) % 10;
  const dayStemIndex = dayIndex % 10;
  const hourStemIndex = ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10;

  const yearStem = HEAVENLY_STEMS[yearStemIndex];
  const yearBranch = EARTHLY_BRANCHES[yearIndex % 12];
  const monthStem = HEAVENLY_STEMS[monthStemIndex];
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  const dayStem = HEAVENLY_STEMS[dayStemIndex];
  const dayBranch = EARTHLY_BRANCHES[dayIndex % 12];
  const hourStem = HEAVENLY_STEMS[hourStemIndex];
  const hourBranch = EARTHLY_BRANCHES[hourBranchIndex];

  const pillars: Pillar[] = [
    buildPillar("年柱", yearStem, yearBranch, dayStem),
    buildPillar("月柱", monthStem, monthBranch, dayStem),
    buildPillar("日柱", dayStem, dayBranch, dayStem),
    buildPillar("时柱", hourStem, hourBranch, dayStem),
  ];

  // 五行分布：四天干各计一分，四地支按本气各计一分
  const counts: Record<FiveElement, number> = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  };
  for (const pillar of pillars) {
    counts[pillar.stemElement] += 1;
    counts[pillar.branchElement] += 1;
  }

  // 十神分布：天干（日主除外）与全部藏干合计
  const tenGodCounts = new Map<TenGod, number>();
  for (const pillar of pillars) {
    if (pillar.tenGod !== "日主") {
      tenGodCounts.set(
        pillar.tenGod,
        (tenGodCounts.get(pillar.tenGod) ?? 0) + 1,
      );
    }
    for (const hidden of pillar.hiddenStems) {
      tenGodCounts.set(
        hidden.tenGod,
        (tenGodCounts.get(hidden.tenGod) ?? 0) + 1,
      );
    }
  }
  const tenGodStats = TEN_GODS.filter((god) => tenGodCounts.has(god))
    .map((god) => ({ tenGod: god, count: tenGodCounts.get(god) ?? 0 }))
    .sort((a, b) => b.count - a.count);

  return {
    input,
    zodiac: ZODIAC[yearIndex % 12],
    hourBranch,
    dayMaster: {
      stem: dayStem,
      element: STEM_ELEMENT[dayStem],
      yang: STEM_YANG[dayStem],
    },
    pillars,
    elements: FIVE_ELEMENTS.map((element) => ({
      element,
      count: counts[element],
    })),
    missing: FIVE_ELEMENTS.filter((element) => counts[element] === 0),
    tenGodStats,
  };
}
