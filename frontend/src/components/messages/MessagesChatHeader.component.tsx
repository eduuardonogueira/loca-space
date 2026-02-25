"use client";

import { ConversationPreview } from "./types";

interface MessagesChatHeaderProps {
  conversation: ConversationPreview;
  onOpenProfile: () => void;
}

export function MessagesChatHeader({
  conversation,
  onOpenProfile,
}: MessagesChatHeaderProps) {
  return (
    <header className="flex h-[106px] items-center justify-between border-b border-[#dcdcdc] bg-white px-6 max-[700px]:h-auto max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3 max-[700px]:py-3">
      <div className="flex items-center gap-4">
        <div className="h-[70px] w-[146px] overflow-hidden rounded-[8px] border border-[#dfdfdf]">
          <img
            src={conversation.roomImageUrl}
            alt={conversation.roomTitle}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-[30px] font-semibold leading-[1.05] text-[#151515] max-[1200px]:text-[24px]">
            {conversation.roomTitle}
          </h3>
          <p className="mt-1 text-[32px] font-semibold text-[#151515] max-[1200px]:text-[24px]">
            R$ {conversation.roomPrice.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenProfile}
        className="text-right transition hover:opacity-75"
      >
        <p className="text-[26px] text-[#151515] max-[1200px]:text-[18px]">
          {conversation.userName}
        </p>
        <p className="text-[28px] font-semibold text-[#151515] max-[1200px]:text-[20px]">
          Ver perfil
        </p>
      </button>
    </header>
  );
}
