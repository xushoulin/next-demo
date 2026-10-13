import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "玄机 AI 隐私政策：说明我们收集哪些信息、如何使用与保护、第三方广告（Google AdSense）如何处理数据，以及你对自己的数据拥有的权利。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">隐私政策</p>
        <h1 className="mt-2 text-3xl font-bold text-white">我们如何对待你的数据</h1>
        <p className="mt-4 text-sm text-slate-400">
          最后更新：2026 年 10 月 13 日。本政策以简体中文为准，适用于玄机 AI 全部功能。
        </p>
      </header>

      <article className="prose-xuanji mt-10">
        <h2>一、我们收集的信息</h2>
        <p>视你的使用方式不同，我们可能处理以下几类信息：</p>
        <ul>
          <li>
            <strong>账户信息</strong>：当你使用用户名登录时，我们会保存你设置的用户名，用于识别你的账户与对话归属。
          </li>
          <li>
            <strong>对话内容</strong>：你在「周公解梦」「风水先生」中的提问与助手回复会被保存——
            未登录时仅存于你的浏览器本地；登录后写入你所绑定的账户，以便跨设备查看。
          </li>
          <li>
            <strong>排盘输入</strong>：使用「八字排盘」时输入的出生年月日时，仅用于生成当次排盘结果并保存记录。
          </li>
          <li>
            <strong>技术信息</strong>：为维持服务稳定运行，我们可能记录必要的访问日志（如时间、页面路径），
            不包含用于识别你个人的额外敏感信息。
          </li>
        </ul>

        <h2>二、我们如何使用这些信息</h2>
        <ul>
          <li>向你返回对应的解读、排盘结果与历史记录；</li>
          <li>在登录状态下，跨设备同步你的对话与排盘记录；</li>
          <li>排查故障、改进提示词与产品体验。</li>
        </ul>
        <p>
          我们<strong>不会</strong>将你的聊天内容用于广告定向投放，也<strong>不会</strong>出售你的个人信息。
        </p>

        <h2>三、第三方服务与广告</h2>
        <p>
          本站可能通过 Google AdSense（及其合作伙伴）展示广告。AdSense 会使用 Cookie
          或类似技术，根据你的浏览行为在第三方网站上提供个性化广告。相关数据处理遵循
          Google 的《广告隐私与条款》。
        </p>
        <p>你可以通过以下方式管理广告偏好：</p>
        <ul>
          <li>
            访问 Google 广告设置（<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">ads.google.com</a>）
            关闭个性化广告；
          </li>
          <li>
            通过{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              Google 广告设置中心
            </a>{' '}
            查看与管理你的广告数据。
          </li>
        </ul>
        <p>
          除必要的模型调用与广告服务外，我们不会主动引入其他会收集你个人信息的第三方脚本。
          大模型调用发生在服务端，提示词与密钥不会进入前端。
        </p>

        <h2>四、Cookie 与本地存储</h2>
        <p>
          我们使用登录态 Cookie 来维持你的登录状态，并使用浏览器本地存储（localStorage）
          在未登录时保存对话。你可以通过浏览器设置清除这些数据，但这会导致未登录期间的对话记录丢失。
        </p>

        <h2>五、数据存储与安全</h2>
        <p>
          登录后的数据存放于你部署环境所连接的数据库中。我们采取合理的技术措施保护数据，
          但请你理解，任何互联网传输都无法保证百分之百安全。
        </p>

        <h2>六、你的权利</h2>
        <ul>
          <li>你随时可以退出登录，并清除浏览器本地存储中的对话；</li>
          <li>如需删除账户相关数据，可通过<Link href="/contact">联系我们</Link>提出请求；</li>
          <li>你可以随时通过浏览器或上述广告设置，撤回对个性化广告的同意。</li>
        </ul>

        <h2>七、儿童隐私</h2>
        <p>
          玄机 AI 的内容面向一般成年用户，不针对 13 岁以下儿童设计，也不会主动收集儿童的个人信息。
        </p>

        <h2>八、政策更新</h2>
        <p>
          我们可能不时更新本政策。如有重大变更，会在本页面标注更新日期。持续使用本站，即表示你接受更新后的政策。
        </p>

        <h2>九、联系我们</h2>
        <p>
          关于隐私的任何疑问或请求，欢迎通过<Link href="/contact">联系我们</Link>页面来信，
          邮件请注明「隐私相关」，我们会优先处理。
        </p>
      </article>
    </div>
  );
}
