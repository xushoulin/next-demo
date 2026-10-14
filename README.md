# 砚知 AI · 通识学习与写作助手 📚✍️🧠

基于 **Next.js 15 + 阿里云百炼（通义千问）** 的多模块 AI 对话应用，面向「学习辅助」场景，通过 Tab 切换三个合规模块：

| 模块 | 能力 |
| --- | --- |
| 📚 **AI 知识问答** | 科学 / 历史 / 文化 / 生活常识的通俗解答，输出「简明回答 / 展开说明 / 延伸与边界」 |
| ✍️ **AI 写作助手** | 润色、扩写、改写与结构化，输出「修改思路 / 修改后文本 / 可继续调整的方向」 |
| 🧠 **AI 学习方法** | 读书笔记、学习计划、思维方法，输出「现状梳理 / 方法建议 / 行动清单」 |

> 内容定位为教育 / 工具类，所有生成内容仅供学习参考，不涉及占卜、医疗诊断、金融建议等受限或高风险类别。

## 功能特性

- **多模块 Tab 切换**：会话相互隔离，切换模块不丢失历史；遵循 WAI-ARIA Tabs 无障碍规范
- **真实流式对话**：Vercel AI SDK 实时流式输出，支持中途停止
- **中文输入法友好**：拼音 / 五笔选词过程中按 Enter 只用于确认候选词，不会误发送半截内容
- **结构化输出**：内置轻量 Markdown 渲染器，按小节呈现解答
- **主题化皮肤**：每个模块一套配色与背景（星空），配置驱动、组件零硬编码
- **本地持久化**：对话按模块分别存入 localStorage（未登录）或本地 MySQL 数据库（登录后），刷新不丢失
- **用户名登录**：免密码登录，登录态以签名 Cookie 保存；登录后可跨设备 / 刷新保留数据
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
| 数据库 | MySQL（`mysql2`，本地库，零额外服务） |

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

# 本地 MySQL 连接串（需先本地启动 MySQL 并建库，例如 CREATE DATABASE yanzhi）
DATABASE_URL=mysql://root:123456@localhost:3306/yanzhi
# 登录 Cookie 签名密钥（生产环境请替换为随机长字符串）
AUTH_SECRET=replace-with-a-random-secret
```

> API Key 获取：登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/) → API-KEY 管理 → 创建新的 API-KEY。
>
> 数据库：本应用使用本地 MySQL。请先在本地启动 MySQL 服务并创建数据库（如上 `yanzhi`），应用会在首次访问数据库时自动建表，无需手动执行 SQL。表结构说明见 `lib/db/schema.sql`。

### 3. 启动

```bash
npm run dev      # 开发，访问 http://localhost:3000
npm run build && npm start   # 生产
```

## 架构设计

```
app/
├── api/
│   ├── chat/route.ts          # 统一入口：校验 agentId → 取提示词 → 流式返回
│   ├── auth/                  # 用户名登录：login / logout / me（签名 Cookie）
│   └── conversations/route.ts # 对话历史：按 (用户, 模块) 读取 / 覆盖保存
├── components/
│   ├── AppShell.tsx           # 登录态外壳：未登录显示登录页，已登录进入主应用
│   ├── LoginScreen.tsx        # 用户名登录页
│   ├── ChatApp.tsx            # 应用外壳：品牌区 + Tab 切换 + 背景 + 用户菜单
│   ├── ChatPanel.tsx          # 单模块会话面板：消息区 + 输入区（常驻挂载，切换不丢会话）
│   ├── AgentTabs.tsx          # Tab 切换（WAI-ARIA）
│   ├── MessageList.tsx        # 消息列表 + 错误提示
│   ├── MessageBubble.tsx      # 消息气泡 + 流式打字指示
│   ├── Composer.tsx           # 输入区（自动增高 / 停止生成）
│   ├── Welcome.tsx            # 空会话欢迎页
│   ├── SuggestionGrid.tsx     # 快捷提问卡片
│   ├── AmbientBackground.tsx  # 主题化背景（星空）
│   ├── ThinkingIndicator.tsx  # 大模型请求中的加载指示器
│   └── Markdown.tsx           # 轻量 Markdown 渲染器
├── (site)/                    # 对外内容站点：首页 / 关于 / 联系 / 隐私 / 知识专栏
├── globals.css
├── layout.tsx
└── page.tsx
lib/
├── agents/
│   ├── types.ts               # 角色领域模型（前后端共享）
│   ├── index.ts               # 客户端安全出口
│   ├── metadata/              # 客户端可见元数据（名称 / 主题 / 快捷提问）
│   │   ├── knowledge.ts
│   │   ├── writing.ts
│   │   ├── study.ts
│   │   └── index.ts           # 角色注册表 + isAgentId 类型守卫
│   └── prompts/               # 服务端专用提示词（不进前端产物）
│       ├── knowledge.ts
│       ├── writing.ts
│       ├── study.ts
│       └── index.ts
├── db/                        # MySQL 数据层：连接池 + 查询 + 自动建表
├── auth.ts                    # 读取 / 生成登录 Cookie（HMAC 签名）
├── hooks/use-chat-session.ts  # 会话 Hook：流式 + 持久化（登录存库 / 未登录存本地）
├── server/
│   ├── dashscope.ts           # 百炼 Provider
│   └── errors.ts              # 上游错误归类
└── utils.ts
```

### 分层约定

- **领域层** `lib/agents`：角色注册表是唯一数据源。新增模块只需加配置，无需改动组件。
- **服务端层** `lib/server`：Provider 与错误归类，仅在 Route Handler 中导入。
- **提示词隔离** `lib/agents/prompts` 与 `lib/agents/metadata` 物理分离，保证提示词不会被打进前端 bundle（已通过产物扫描验证）。
- **组件层** `app/components`：全部为纯展示组件，主题由 `agent.theme` 注入，不含硬编码配色。

### 新增一个模块

1. 在 `lib/agents/types.ts` 的 `ChatAgentId` 联合类型中加入新 ID；
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
| `DATABASE_URL` | 登录后持久化时必填 | 本地 MySQL 连接串，例如 `mysql://root:123456@localhost:3306/yanzhi` |
| `AUTH_SECRET` | 建议 | 登录 Cookie 签名密钥；不设置则使用不安全的开发默认值 |

## 部署到 Vercel

1. 将仓库推送到 GitHub，在 Vercel 中导入项目；
2. 在项目设置 **Environment Variables** 中添加 `DASHSCOPE_API_KEY`（及可选的 `DASHSCOPE_MODEL`）；
3. 部署完成即可访问。注意 `metadataBase` 与 `robots.ts` / `sitemap.ts` 中的站点域名需与实际部署域名一致。

## 常见问题

**Q：登录后提示「登录失败，请确认本地数据库已连接」？**

说明 `DATABASE_URL` 未配置或本地 MySQL 未启动 / 数据库不存在。请先 `CREATE DATABASE yanzhi`（或你的库名），确认连接串正确，并在 `.env.local` 中设置 `DATABASE_URL` 后重启服务。应用会在首次访问时自动建表。

**Q：未登录也能用吗？数据存在哪？**

可以。未登录时对话仍按模块存入浏览器 `localStorage`，刷新不丢失；登录后数据改为写入本地 MySQL 数据库（账户与各模块对话历史），可与同一用户名跨会话 / 跨设备共享。

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
2. **不放整段少样本示例**：示例中的具体意象会被套用到所有回答上，造成内容污染，已移除。
3. **显式禁令**：`<禁止事项>` 明确禁止复述提问、照抄提示词、指令式套话、中英夹杂、空话套话与重复罗列。
4. **采样参数**：`temperature` 0.5~0.65 配合 `topP=0.8`（通义千问官方推荐值），并用
   `maxOutputTokens` 兜底。仅设 temperature 而不设 topP 时，容易出现「反复罗列」的退化循环。

## 模型选型（重要）

**建议使用对话模型**（`qwen-plus` / `qwen-max` / `qwen-turbo` / `qwen3.8-27b` 等）。
OCR、向量、重排、语音、图像类模型（如 `qwen3.5-ocr`）**不具备指令跟随能力**，
用于聊天会复述用户提问、反复罗列词语，输出完全答非所问——这类问题无法通过调提示词解决。

项目不对模型名做任何拦截，`DASHSCOPE_MODEL` 填什么就调用什么，方便你自由切换与试验。
若发现回答异常，优先检查这里配的是不是对话模型。

## 免责声明

- 知识问答内容基于公开常识与通用资料整理，仅供学习参考，不保证绝对准确，不构成医疗、法律、金融或任何专业建议。
- 写作助手生成内容仅作创作辅助，请使用者自行核对事实与原创性，并遵守所在场景（学校、期刊、公司等）对 AI 使用的规则。
- 学习方法建议效果因人而异，请结合自身情况调整，必要时参考教育专业人士意见。
