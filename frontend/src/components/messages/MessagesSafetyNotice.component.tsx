"use client";

import { ShieldAlert } from "lucide-react";

export function MessagesSafetyNotice() {
  return (
    <div className="mx-auto flex h-10 w-full max-w-[560px] items-center justify-center gap-2 rounded-full bg-[#edb0a8] px-4 text-center text-[13px] font-semibold text-[#2f1f1f]">
      <ShieldAlert size={16} />
      <span>
        Não envie informações pessoais para vendedores para ter mais segurança
      </span>
    </div>
  );
}
