import { cleanupTestUser } from "./db";

/** 跑测试前先清一次，确保起点干净（可重复执行的前提） */
export default async function globalSetup(): Promise<void> {
  const result = await cleanupTestUser();
  if (result.skipped) {
    console.log(`[global-setup] ${result.reason}`);
  } else {
    console.log(
      `[global-setup] 已清理历史测试数据：用户 ${result.users} 条 / 会话 ${result.conversations} 条`,
    );
  }
}
