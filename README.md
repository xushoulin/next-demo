# 玄机 AI · 周公解梦 & 风水先生 🌙🧭

基于 **Next.js 15 + 阿里云百炼（通义千问）** 的多角色 AI 对话应用。内置两个东方玄学角色，通过 Tab 切换：

| 角色 | 能力 |
| --- | --- |
| 🌙 **AI 周公解梦** | 融合《周公解梦》传统典籍与现代心理学，输出梦境概述 / 传统解梦 / 心理分析 / 现实提示 |
| 🧭 **AI 风水先生** | 形势派 + 理气派视角，输出形势勘察 / 理气分析 / 五行调和 / 布局建议（含改动成本分层） |

## 功能特性

- **多角色 Tab 切换**：会话相互隔离，切换角色不丢失历史；遵循 WAI-ARIA Tabs 无障碍规范
- **真实流式对话**：Vercel AI SDK 实时流式输出，支持中途停止
- **中文输入法友好**：拼音/五笔选词过程中按 Enter 只用于确认候选词，不会误发送半截内容
- **结构化输出**：内置轻量 Markdown 渲染器，按小节呈现解读结果
- **主题化皮肤**：每个角色一套配色与背景（星空 / 远山），配置驱动、组件零硬编码
- **本地持久化**：对话按角色分别存入 localStorage，刷新不丢失
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
DASHSCOPE_MODEL=qwen-plus
DASHSCOPE_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
```

> API Key 获取：登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/) → API-KEY 管理 → 创建新的 API-KEY。

### 3. 启动

```bash
npm run dev      # 开发，访问 http://localhost:3000
npm run build && npm start   # 生产
```

## 架构设计

```
app/
├── api/chat/route.ts          # 统一入口：校验 agentId → 取提示词 → 流式返回
├── components/
│   ├── ChatApp.tsx            # 应用外壳：品牌区 + Tab 切换 + 背景
│   ├── ChatPanel.tsx          # 单角色会话面板：消息区 + 输入区（常驻挂载，切换不丢会话）
│   ├── AgentTabs.tsx          # Tab 切换（WAI-ARIA）
│   ├── MessageList.tsx        # 消息列表 + 错误提示
│   ├── MessageBubble.tsx      # 消息气泡 + 流式打字指示
│   ├── Composer.tsx           # 输入区（自动增高 / 停止生成）
│   ├── Welcome.tsx            # 空会话欢迎页
│   ├── SuggestionGrid.tsx     # 快捷提问卡片
│   ├── AmbientBackground.tsx  # 主题化背景（星空 / 远山）
│   └── Markdown.tsx           # 轻量 Markdown 渲染器
├── globals.css
├── layout.tsx
└── page.tsx
lib/
├── agents/
│   ├── types.ts               # 角色领域模型（前后端共享）
│   ├── index.ts               # 客户端安全出口
│   ├── metadata/              # 客户端可见元数据（名称 / 主题 / 快捷提问）
│   │   ├── dream.ts
│   │   ├── fengshui.ts
│   │   └── index.ts           # 角色注册表 + isAgentId 类型守卫
│   └── prompts/               # 服务端专用提示词（不进前端产物）
│       ├── dream.ts
│       ├── fengshui.ts
│       └── index.ts
├── hooks/use-chat-session.ts  # 会话 Hook：流式 + 持久化 + 停止/清空
├── server/
│   ├── dashscope.ts           # 百炼 Provider
│   └── errors.ts              # 上游错误归类
└── utils.ts
```

### 分层约定

- **领域层** `lib/agents`：角色注册表是唯一数据源。新增角色只需加配置，无需改动组件。
- **服务端层** `lib/server`：Provider 与错误归类，仅在 Route Handler 中导入。
- **提示词隔离** `lib/agents/prompts` 与 `lib/agents/metadata` 物理分离，保证提示词不会被打进前端 bundle（已通过产物扫描验证）。
- **组件层** `app/components`：全部为纯展示组件，主题由 `agent.theme` 注入，不含硬编码配色。

### 新增一个角色

1. 在 `lib/agents/types.ts` 的 `AgentId` 联合类型中加入新 ID；
2. 新建 `lib/agents/metadata/<id>.ts`，定义名称、图标、主题、快捷提问；
3. 新建 `lib/agents/prompts/<id>.ts`，定义系统提示词；
4. 在 `lib/agents/metadata/index.ts` 的 `AGENTS` 与 `lib/agents/prompts/index.ts` 的 `AGENT_RUNTIME` 中注册。

页面会自动出现新的 Tab 与会话面板，无需修改任何组件。

## 环境变量说明

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DASHSCOPE_API_KEY` | 是 | 百炼 API Key，仅服务端读取 |
| `DASHSCOPE_MODEL` | 否 | 模型名称，默认 `qwen-plus`；可换 `qwen-max`、`qwen-turbo` 等 |
| `DASHSCOPE_API_BASE` | 否 | OpenAI 兼容地址，默认官方地址，一般无需修改 |

## 部署到 Vercel

1. 将仓库推送到 GitHub，在 Vercel 中导入项目；
2. 在项目设置 **Environment Variables** 中添加 `DASHSCOPE_API_KEY`（及可选的 `DASHSCOPE_MODEL`）；
3. 部署完成即可访问。

## 常见问题

**Q：提示「百炼账户额度不足 / Free quota exhausted」？**

说明 API Key 有效，但免费额度已用完。请到百炼控制台关闭「仅使用免费额度」模式，或为账户充值后重试。

**Q：提示「API Key 无效或已过期」？**

检查服务端的 `DASHSCOPE_API_KEY`，修改后需重启服务。

**Q：为什么用 `dashscope.chat()` 而不是 `dashscope()`？**

`@ai-sdk/openai` v3 中 `createOpenAI()` 返回的可调用对象默认走 **OpenAI Responses API**，而百炼兼容模式只支持 **Chat Completions**。必须显式调用 `.chat(modelId)`，否则请求会失败。

**Q：如何更换模型？**

在 `.env.local` 中修改 `DASHSCOPE_MODEL`：`qwen-max`（效果更好）、`qwen-turbo`（更快更便宜）。
注意不同模型的免费额度是分开的，若某个模型报「额度不足」，可换另一个或为账户充值。

**Q：回答答非所问、复述我的提问、反复罗列词语？**

先检查 `DASHSCOPE_MODEL` 是否被配成了 OCR / 向量 / 语音 / 图像类模型（如 `qwen3.5-ocr`）。
这类模型不会"回答"问题，只会做文本续写，因此必然答非所问——换成 `qwen-plus` / `qwen-max` 即可。
若模型本身是对话模型但仍有瑕疵，可参考下方「提示词设计」一节调整。

## 提示词设计

提示词位于 `lib/agents/prompts/`，采用标签分区结构，专为抑制弱模型的「指令回显」问题设计：

1. **输出格式与写作要点分离**：`<输出格式>` 只给标题骨架，内容说明放进 `<写作要点>` 并标注「绝对不要写进回答」。
   （若把说明直接写在标题后面，模型会把它当正文照抄，造成答非所问。）
2. **不放整段少样本示例**：曾加入示例以规范深度，结果示例中的具体意象（如「灶台对水龙头」）
   被套用到所有回答上，造成内容污染，已移除。
3. **显式禁令**：`<禁止事项>` 明确禁止复述提问、照抄提示词、指令式套话、中英夹杂、空话套话与重复罗列。
4. **采样参数**：`temperature` 0.7~0.75 配合 `topP=0.8`（通义千问官方推荐值），并用
   `maxOutputTokens` 兜底。仅设 temperature 而不设 topP 时，容易出现「反复罗列」的退化循环。

## 模型选型（重要）

**建议使用对话模型**（`qwen-plus` / `qwen-max` / `qwen-turbo` / `qwen3.8-27b` 等）。
OCR、向量、重排、语音、图像类模型（如 `qwen3.5-ocr`）**不具备指令跟随能力**，
用于聊天会复述用户提问、反复罗列词语，输出完全答非所问——这类问题无法通过调提示词解决。

项目不对模型名做任何拦截，`DASHSCOPE_MODEL` 填什么就调用什么，方便你自由切换与试验。
若发现回答异常，优先检查这里配的是不是对话模型。

## 免责声明

- 解梦内容基于传统文化与心理学知识，仅供娱乐与自我觉察参考，不构成医疗或心理咨询建议。
- 风水内容属传统民俗文化与环境心理学范畴；凡涉及承重墙、消防、燃气、电路、采光通风等，请以专业设计与安全规范为准。
