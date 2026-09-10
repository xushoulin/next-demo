import type { UIMessage } from "ai";

/** 提取一条 UIMessage 中的纯文本内容 */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}
