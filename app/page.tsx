"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({
      text: input,
    });

    setInput("");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <p className="text-sm text-gray-500">Next.js + Vercel + AI SDK</p>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-black text-white px-4 py-3"
                    : "max-w-[80%] rounded-2xl bg-white border px-4 py-3"
                }
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.text}</span>;
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>

        {status === "streaming" && (
          <div className="mt-4 text-sm text-gray-500">AI 正在思考...</div>
        )}
      </div>

      <div className="border-t bg-white">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-4 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={status === "streaming"}
            className="rounded-xl bg-black text-white px-6 py-3 disabled:opacity-50"
          >
            发送
          </button>
        </form>
      </div>
    </main>
  );
}
