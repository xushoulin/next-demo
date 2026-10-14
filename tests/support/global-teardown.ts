import { cleanupTestUser } from "./db";

/** 跑完后清理固定账号，避免污染数据库与下次运行 */
export default async function globalTeardown(): Promise<void> {
  const result = await cleanupTestUser();
  if (result.skipped) {
    console.log(`[global-teardown] ${result.reason}`);
  } else {
    console.log(
      `[global-teardown] 已清理测试数据：用户 ${result.users} 条 / 会话 ${result.conversations} 条`,
    );
  }
}
