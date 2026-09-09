"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "学习 Next.js App Router", done: false },
    { id: 2, text: "写一个 demo", done: true },
  ]);
  const [input, setInput] = useState("");

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInput("");
  }

  function toggle(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function remove(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="要做点什么？"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          添加
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="h-4 w-4 accent-slate-900"
            />
            <span
              className={`flex-1 text-sm ${
                t.done ? "text-slate-400 line-through" : "text-slate-800"
              }`}
            >
              {t.text}
            </span>
            <button
              onClick={() => remove(t.id)}
              className="text-xs text-slate-400 transition hover:text-red-500"
              aria-label="删除"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-slate-500">
        还剩 {remaining} 项未完成 · 共 {todos.length} 项
      </p>
    </div>
  );
}
