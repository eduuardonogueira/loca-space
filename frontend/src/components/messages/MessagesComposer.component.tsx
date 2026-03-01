"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

interface MessagesComposerProps {
  onSend: (content: string) => void;
  onTyping?: () => void;
}

export function MessagesComposer({ onSend, onTyping }: MessagesComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onTyping?.();
  };

  const handleQuickMessage = (text: string) => {
    onSend(text);
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => handleQuickMessage("Ainda está disponível?")}
          className="rounded-full border border-[#1d84ff] px-3 py-1.5 text-[12px] font-medium text-[#1d84ff] transition hover:bg-[#eaf3ff]"
        >
          Ainda está disponível?
        </button>
        <button
          type="button"
          onClick={() => handleQuickMessage("Tenho interesse!")}
          className="rounded-full border border-[#8c8c8c] px-3 py-1.5 text-[12px] font-medium text-[#4a4a4a] transition hover:bg-[#f2f2f2]"
        >
          Tenho interesse!
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-[#d8d8d8] bg-white px-3">
        <input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem"
          className="h-11 flex-1 bg-transparent text-[13px] text-[#222] outline-none placeholder:text-[#a2a2a2]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#dc4d3f] transition hover:bg-[#fff0ef] disabled:opacity-40"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
