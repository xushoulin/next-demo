import TodoApp from "./components/TodoApp";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center px-6 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Next.js Demo
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          App Router · 服务端组件 + 客户端组件协作
        </p>
      </header>

      <TodoApp />

      <footer className="mt-16 text-xs text-slate-400">
        用 <code className="font-mono">npx next dev</code> 启动开发服务器
      </footer>
    </main>
  );
}
