import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "尚美智宿是酒店智能服务助手，把酒店服务信息、预订指引与会员权益整理进一次自然对话，帮助客人更轻松地完成从预订到退房的每一步。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">关于我们</p>
        <h1 className="mt-2 text-3xl font-bold text-white">把酒店服务，装进一个对话框</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          尚美智宿是一个面向酒店场景的智能服务助手，把设施服务、预订流程、会员权益这些
          常常「要问好几趟」的信息放在一起，用一次自然对话，帮客人把住前住中住后的事安排清楚。
        </p>
      </header>

      <article className="prose-article mt-10">
        <h2>我们为什么做这件事</h2>
        <p>
          出行的人常遇到同一类麻烦：想用泳池却不知道开放时间，想订房却分不清房型差异，
          有会员积分却不知道怎么用。这些问题的答案其实都在，只是散落在不同的页面、电话和口头答复里。
          我们想做的中间层是：
          <strong>把酒店服务信息整理成一次对话就能拿到的、可行动的答案</strong>。
        </p>
        <p>
          所以尚美智宿不替代前台，也不代替预订系统，而是提供一个新的入口——
          当客人愿意把需求讲出来时，它帮客人理清选项、给出办理路径，最终的决定与操作始终在客人手里。
        </p>

        <h2>我们是怎么工作的</h2>
        <p>
          尚美智宿由三个模块组成，每个模块背后都是一套经过设计的提示词：
        </p>
        <ul>
          <li>
            <strong>智能礼宾</strong>：从「快速解答 → 详细说明 → 温馨提示」三个层次展开，
            既给出结论，也补充注意事项与替代方案。
          </li>
          <li>
            <strong>智能预订助手</strong>：从房型推荐、预订指引到温馨提示，帮客人选对房型、理清流程；
            涉及真实下单与支付，始终引导官方渠道完成。
          </li>
          <li>
            <strong>会员服务助手</strong>：从权益解答、办理指引到温馨提示，把会员权益与办理步骤讲清楚、可执行。
          </li>
        </ul>
        <p>
          所有生成内容都由大模型实时产出，对话过程尽量以清晰的小节呈现，方便阅读与继续追问。
        </p>

        <h2>我们对内容边界的坚持</h2>
        <p>
          酒店服务涉及价格、房态与个人信息，边界比一般工具更重要。为此：
        </p>
        <ul>
          <li>不承诺任何具体价格与房态库存，一律提示以官方渠道实时信息为准；</li>
          <li>不代替客人执行下单、支付、积分兑换等真实操作，只提供指引；</li>
          <li>不透露任何住客个人信息，投诉与赔偿类事项引导人工客服处理；</li>
          <li>我们不会用聊天内容来做广告定向，也不会把你的对话用于训练以外的用途。</li>
        </ul>

        <h2 id="disclaimer">免责声明</h2>
        <blockquote>
          助手回答基于酒店公开服务信息与通用常识整理，仅供参考，不保证绝对准确，不构成任何交易承诺或专业建议。
          价格、房态、会员权益等动态信息以官方渠道与酒店现场公示为准；真实预订与账户操作请通过官方渠道办理。
        </blockquote>
        <p>
          如果你对内容、功能或隐私有任何疑问，欢迎通过
          <Link href="/contact">联系我们</Link>页面与我们沟通。
        </p>
      </article>
    </div>
  );
}
