# 尚美智宿 · 酒店智能服务助手 🏨🛎️

基于 **Next.js 15 + 阿里云百炼（通义千问）** 的酒店场景多模块 AI 对话应用，通过 Tab 切换三个服务模块：

| 模块 | 能力 |
| --- | --- |
| 🛎️ **智能礼宾** | 酒店设施与服务时间、周边推荐、酒店政策解答 |
| 🛏️ **智能预订助手** | 房型推荐、价格构成说明、预订流程与入住办理指引 |
| 💳 **会员服务助手** | 会员权益、积分规则、房型升级与售后办理指引 |

> 内容定位为酒店服务咨询，所有回答仅供参考；不承诺具体价格与房态，不代替客人执行下单、支付与账户操作。

## 功能特性

- **多模块 Tab 切换**：会话相互隔离，切换模块不丢失历史；遵循 WAI-ARIA Tabs 无障碍规范
- **真实流式对话**：Vercel AI SDK 实时流式输出，支持中途停止
- **酒店业务接口**：房型列表 / 预订创建 / 会员档案三组 BFF 接口（`/api/hotel/*`），通过 PMS 适配层隔离实现
- **PMS 适配层**：`lib/server/adapters/pms.ts` 为对接内部系统的唯一替换点，当前为本地数据库演示模式
- **示例数据自播种**：首次启动自动建表并写入示例房型，即开即用
- **中文输入法友好**：拼音 / 五笔选词过程中按 Enter 只用于确认候选词，不会误发送半截内容
- **结构化输出**：内置轻量 Markdown 渲染器，按小节呈现解答
- **主题化皮肤**：每个模块一套配色与背景，配置驱动、组件零硬编码
- **本地持久化**：对话按模块分别存入 localStorage（未登录）或数据库（登录后），刷新不丢失
- **用户名登录**：免密码登录，登录态以签名 Cookie 保存
- **服务端鉴权**：API Key 与系统提示词只存在于服务端，不进入前端产物
- **错误可行动**：额度、Key、模型、超时等上游错误统一归类为中文提示

## 技术栈

| 层 | 技术 |
| --- | --- |
| 框架 | Next.js 15（App Router）+ React 19 |
| 语言 | TypeScript（strict） |
| 样式 | Tailwind CSS |
| 大模型 | 阿里云百炼 DashScope（OpenAI 兼容模式） |
| 流式 SDK | Vercel AI SDK（`ai` / `@ai-sdk/react` / `@ai-sdk/openai`） |
| 数据库 | PostgreSQL（`pg` 驱动，兼容 Neon 等托管库） |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

```env
DASHSCOPE_API_KEY=sk-你的百炼APIKey
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
AUTH_SECRET=replace-with-a-random-secret
```

### 3. 启动

```bash
npm run dev
```

打开 http://localhost:3000 即可体验；首次访问数据库时自动建表并播种示例房型。

## 酒店业务接口

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| GET | `/api/hotel/rooms` | 在售房型列表 | 公开 |
| GET | `/api/hotel/bookings` | 当前用户预订列表 | 登录 |
| POST | `/api/hotel/bookings` | 创建预订（服务端计价） | 登录 |
| GET | `/api/hotel/member` | 当前用户会员档案 | 登录 |

## 数据表

`users` / `conversations` / `room_types` / `rooms` / `bookings` / `members`，详见 `lib/db/schema.sql`。

## 测试

```bash
npm run test:e2e        # Mock 模式，不消耗 token
npm run test:e2e:real   # 真实模型链路验证
```
