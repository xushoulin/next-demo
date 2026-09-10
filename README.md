# AI 周公解梦 🌙

一个基于 **Next.js + 阿里云百炼（通义千问）大模型** 的 AI 梦境解读聊天助手。
用户描述梦境后，AI 会以「周公」的身份，结合《周公解梦》传统典籍与现代心理学，
给出结构化的中文解读：梦境概述、传统解梦、心理分析、现实提示。

## 功能特性

- **流式对话**：基于 Vercel AI SDK 的实时流式输出，边生成边显示
- **结构化解读**：Markdown 渲染，分小节输出传统解梦与心理分析
- **快捷梦境**：内置常见梦境一键提问（蛇、掉牙、飞翔、大海等）
- **本地记忆**：对话自动保存在浏览器 localStorage，刷新不丢失
- **星空主题**：月夜星空 UI，支持停止生成、清空对话、错误提示
- **真实后端**：`/api/chat` 服务端路由直连百炼 OpenAI 兼容接口，API Key 不暴露到前端

## 技术栈

| 层 | 技术 |
| --- | --- |
| 框架 | Next.js 15（App Router）+ React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 大模型 | 阿里云百炼 DashScope（OpenAI 兼容模式） |
| 流式 SDK | Vercel AI SDK（`ai` / `@ai-sdk/react` / `@ai-sdk/openai`） |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制示例文件并填入你的百炼 API Key：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
DASHSCOPE_API_KEY=sk-你的百炼APIKey
DASHSCOPE_MODEL=qwen-plus
DASHSCOPE_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
```

> API Key 获取：登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/) → API-KEY 管理 → 创建新的 API-KEY。

### 3. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 即可开始解梦。

### 4. 生产构建

```bash
npm run build && npm start
```

## 环境变量说明

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DASHSCOPE_API_KEY` | 是 | 百炼 API Key |
| `DASHSCOPE_MODEL` | 否 | 模型名称，默认 `qwen-plus`；可换 `qwen-max`、`qwen-turbo` 等 |
| `DASHSCOPE_API_BASE` | 否 | OpenAI 兼容地址，默认官方地址，一般无需修改 |

## 目录结构

```
app/
├── api/chat/route.ts        # 后端：调用百炼模型，流式返回解梦内容
├── components/
│   ├── DreamChat.tsx        # 前端：聊天界面（欢迎页 / 消息流 / 输入框）
│   └── Markdown.tsx         # 轻量 Markdown 渲染器
├── globals.css              # 全局样式与主题
├── layout.tsx               # 根布局与元信息
└── page.tsx                 # 首页
```

## 部署到 Vercel

1. 将仓库推送到 GitHub，在 Vercel 中导入项目；
2. 在 Vercel 项目设置的 **Environment Variables** 中添加 `DASHSCOPE_API_KEY`（及可选的 `DASHSCOPE_MODEL`）；
3. 部署完成即可访问。

## 常见问题

**Q：提示「百炼账户额度不足 / Free quota exhausted」？**

说明 API Key 有效，但账户免费额度已用完。请到阿里云百炼控制台：
关闭「仅使用免费额度」模式，或为账户充值后重试。

**Q：提示「API Key 无效或已过期」？**

检查 `.env.local` 中的 `DASHSCOPE_API_KEY` 是否正确，修改后需重启 `npm run dev`。

**Q：如何更换模型？**

在 `.env.local` 中修改 `DASHSCOPE_MODEL`，例如 `qwen-max`（效果更好）、`qwen-turbo`（更快更便宜）。

> 注意：百炼的 OpenAI 兼容模式只支持 Chat Completions 接口，因此代码中使用
> `dashscope.chat(MODEL)` 而非 `dashscope(MODEL)`（后者会走 OpenAI Responses API 而报错）。

## 免责声明

解读内容基于传统文化与心理学知识，仅供娱乐与自我觉察参考，**不构成医疗、心理咨询或任何专业建议**。
若梦境长期困扰并影响生活，请寻求专业心理帮助。
