"use client";

import { Search } from "lucide-react";
import { ConversationPreview } from "./types";
import { ConversationListItem } from "./ConversationListItem.component";

interface MessagesSidebarProps {
  conversations: ConversationPreview[];
  selectedConversationId: number;
  onSelectConversation: (id: number) => void;
}

export function MessagesSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: MessagesSidebarProps) {
  return (
    <aside className="flex h-full w-full max-w-[300px] flex-col border-r border-[#dddddd] bg-[#f8f8f8] max-[980px]:max-w-none max-[980px]:border-r-0 max-[980px]:border-b">
      <div className="border-b border-[#dfdfdf] px-4 py-4">
        <h2 className="text-[24px] font-semibold text-[#151515]">Mensagens</h2>
        <div className="mt-3 flex h-10 items-center gap-2 rounded-lg border border-[#dadada] bg-[#f6f6f6] px-3">
          <Search size={16} className="text-[#9f9f9f]" />
          <input
            type="text"
            placeholder="Busque por produto ou usuário"
            className="h-full w-full bg-transparent text-[12px] text-[#333] outline-none placeholder:text-[#b4b4b4]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </aside>
  );
}
