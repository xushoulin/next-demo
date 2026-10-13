import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "联系我们",
  description:
    "对砚知 AI 有功能建议、使用疑问或内容反馈？通过邮箱或页面表单与我们联系，我们会认真阅读每一条消息。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">联系我们</p>
        <h1 className="mt-2 text-3xl font-bold text-white">我们很想听听你的想法</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          无论是功能建议、使用中遇到的问题，还是对内容的任何想法，都欢迎告诉我们。
          这是个人项目，回复可能不会即时，但每一条消息都会被认真看到。
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-amber-100">直接发邮件</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            如果你更习惯用邮件，也可以直接发送到下面的地址：
          </p>
          <a
            href="mailto:support@yourdomain.com"
            className="mt-3 inline-block rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-amber-100"
          >
            support@yourdomain.com
          </a>

          <h2 className="mt-8 text-lg font-semibold text-amber-100">响应时间</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            邮件通常在数个工作日内回复。涉及账号、数据或隐私的问题，我们会优先处理。
          </p>

          <h2 className="mt-8 text-lg font-semibold text-amber-100">内容纠错</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            若你认为某次解读引用有误、表述不当，或有值得补充的视角，欢迎指出，我们会持续打磨提示词。
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
