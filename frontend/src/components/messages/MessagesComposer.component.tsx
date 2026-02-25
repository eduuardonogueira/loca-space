"use client";

import { SendHorizontal } from "lucide-react";

interface MessagesComposerProps {
  value: string;
  onChange: (value: string) => void;
}

export function MessagesComposer({ value, onChange }: MessagesComposerProps) {
  return (
    <div className="mt-5">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          className="rounded-full border border-[#1d84ff] px-3 py-1.5 text-[12px] font-medium text-[#1d84ff] transition hover:bg-[#eaf3ff]"
        >
          Ainda está disponível?
        </button>
        <button
          type="button"
          className="rounded-full border border-[#8c8c8c] px-3 py-1.5 text-[12px] font-medium text-[#4a4a4a] transition hover:bg-[#f2f2f2]"
        >
          Tenho interesse!
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-[#d8d8d8] bg-white px-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite uma mensagem"
          className="h-11 flex-1 bg-transparent text-[13px] text-[#222] outline-none placeholder:text-[#a2a2a2]"
        />
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#dc4d3f] transition hover:bg-[#fff0ef]"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
