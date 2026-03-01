"use client";

import type { ChatMessage } from "@/types/messages";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          relative max-w-[70%] rounded-2xl px-4 py-2.5
          ${
            isOwn
              ? "bg-[#e74f3d] text-white rounded-br-sm"
              : "bg-white text-[#222] border border-[#e5e5e5] rounded-bl-sm"
          }
        `}
      >
        {!isOwn && (
          <p className="text-[11px] font-semibold text-[#888] mb-0.5">
            {message.senderName}
          </p>
        )}

        <p className="text-[13px] leading-[1.4] break-words">
          {message.content}
        </p>

        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${
              isOwn ? "text-white/70" : "text-[#aaa]"
            }`}
          >
            {time}
          </span>
          {isOwn && (
            <span
              className={`text-[10px] ${
                message.isRead ? "text-white" : "text-white/50"
              }`}
            >
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
