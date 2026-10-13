import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "砚知 AI 是一个通识学习与写作辅助助手，把可靠的科普讲解、务实的写作辅助与经过验证的学习方法，用自然对话的方式交到你手里。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">关于我们</p>
        <h1 className="mt-2 text-3xl font-bold text-white">把靠谱的知识，讲成今天能听懂的话</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          砚知 AI 是一个学习辅助项目，试图把零散却有用的知识——科普原理、写作方法、学习策略——
          与当代人真正会遇到的场景放在一起，用一次自然对话，帮你把模糊的疑问说清楚。
        </p>
      </header>

      <article className="prose-article mt-10">
        <h2>我们为什么做这件事</h2>
        <p>
          每个人都会冒出「为什么会这样」的疑问，也都在某个时刻卡在一篇写不顺的稿子上。
          可当真要去查、去写时，要么淹没在碎片化的信息里，要么被晦涩的术语劝退。我们想做的中间层是：
          <strong>把值得了解的那部分知识，用现代人能理解、能落地的方式讲出来</strong>。
        </p>
        <p>
          所以砚知 AI 不是要替你思考或代你写作，而是提供一个低门槛的对话入口——
          当你愿意把问题或草稿讲出来时，它帮你梳理线索、给出可操作的建议，剩下的判断权始终在你手里。
        </p>

        <h2>我们是怎么工作的</h2>
        <p>
          砚知 AI 由三个模块组成，每个模块背后都是一套经过设计的提示词：
        </p>
        <ul>
          <li>
            <strong>知识问答</strong>：从「简明回答 → 展开说明 → 延伸与边界」三个层次展开，
            既给出结论，也说明原理与知识的适用边界。
          </li>
          <li>
            <strong>写作助手</strong>：从修改思路、修改后文本到可继续调整的方向，帮你把文字打磨得更清楚、更有力，而不是替你凭空成稿。
          </li>
          <li>
            <strong>学习方法</strong>：从现状梳理、方法建议到行动清单，给你今天就能开始做的具体步骤。
          </li>
        </ul>
        <p>
          所有生成内容都由大模型实时产出，对话过程尽量以清晰的小节呈现，方便你阅读和继续追问。
        </p>

        <h2>我们对内容边界的坚持</h2>
        <p>
          我们始终认为，这类工具应当被放在「学习辅助」的位置上，而不是替你做决定。为此：
        </p>
        <ul>
          <li>知识类内容均标注「仅供参考、以权威资料为准」的提醒；</li>
          <li>凡涉及医疗、法律、金融等专业领域，一律提示以专业人士意见为准；</li>
          <li>写作助手只做辅助润色与思路梳理，不鼓励代写作业或考试答案；</li>
          <li>我们不会用聊天内容来做广告定向，也不会把你的对话用于训练以外的用途。</li>
        </ul>

        <h2 id="disclaimer">免责声明</h2>
        <blockquote>
          知识问答内容基于公开常识与通用资料整理，仅供学习参考，不保证绝对准确，不构成医疗、法律、金融或任何专业建议。
          写作助手生成内容仅作创作辅助，请自行核对事实与原创性。学习方法建议效果因人而异，请结合自身情况调整。
        </blockquote>
        <p>
          如果你对内容、功能或隐私有任何疑问，欢迎通过
          <Link href="/contact">联系我们</Link>页面与我们沟通。
        </p>
      </article>
    </div>
  );
}
