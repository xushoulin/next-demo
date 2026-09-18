import type { BaziChart } from "@/lib/bazi";

/** 一条八字排盘记录（服务端持久化后回传前端的结构） */
export type BaziRecord = {
  id: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  chart: BaziChart;
  createdAt: string;
};
