import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "尚美智宿隐私政策：说明我们收集哪些信息、如何使用与保护，以及你对自己的数据拥有的权利。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">隐私政策</p>
        <h1 className="mt-2 text-3xl font-bold text-white">我们如何对待你的数据</h1>
        <p className="mt-4 text-sm text-slate-400">
          最后更新：2026 年 10 月 14 日。本政策以简体中文为准，适用于尚美智宿全部功能。
        </p>
      </header>

      <article className="prose-article mt-10">
        <h2>一、我们收集的信息</h2>
        <p>视你的使用方式不同，我们可能处理以下几类信息：</p>
        <ul>
          <li>
            <strong>账户信息</strong>：当你使用用户名登录时，我们会保存你设置的用户名，用于识别你的账户、对话与预订归属。
          </li>
          <li>
            <strong>对话内容</strong>：你在「智能礼宾」「智能预订助手」「会员服务助手」中的提问与助手回复会被保存——
            未登录时仅存于你的浏览器本地；登录后写入你所绑定的账户，以便跨设备查看。
          </li>
          <li>
            <strong>预订与会员信息</strong>：当你使用预订功能时，我们会处理入住人姓名、联系电话、入住与离店日期等信息，
            仅用于创建与管理你的预订；会员档案（等级、积分）仅用于会员服务展示。
          </li>
          <li>
            <strong>技术信息</strong>：为维持服务稳定运行，我们可能记录必要的访问日志（如时间、页面路径），
            不包含用于识别你个人的额外敏感信息。
          </li>
        </ul>

        <h2>二、我们如何使用这些信息</h2>
        <ul>
          <li>向你返回对应的礼宾解答、房型推荐与办理指引；</li>
          <li>在登录状态下，跨设备同步你的对话与预订记录；</li>
          <li>排查故障、改进提示词与产品体验。</li>
        </ul>
        <p>
          我们<strong>不会</strong>将你的聊天内容用于广告定向投放，也<strong>不会</strong>出售你的个人信息。
        </p>

        <h2>三、第三方服务</h2>
        <p>
          本站的智能回答由大模型服务在服务端生成，提示词与密钥不会进入前端；
          我们不会主动引入其他会收集你个人信息的第三方脚本。
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
          <li>如需删除账户、预订或会员相关数据，可通过<Link href="/contact">联系我们</Link>提出请求；</li>
          <li>涉及预订的取消与退款，请通过官方渠道办理。</li>
        </ul>

        <h2>七、儿童隐私</h2>
        <p>
          尚美智宿的内容面向一般用户，不针对 13 岁以下儿童设计，也不会主动收集儿童的个人信息。
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
