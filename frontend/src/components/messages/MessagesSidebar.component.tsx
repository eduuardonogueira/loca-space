"use client";

import { Search } from "lucide-react";
import { ConversationListItem } from "./ConversationListItem.component";
import { ConversationPreview } from "@/types/messages";

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
    <aside
      className="
        flex h-full w-full max-w-75 flex-col
        border-r border-gray-300 bg-gray-50
        max-[980px]:max-w-none max-[980px]:border-r-0 
        max-[980px]:border-b
      "
    >
      <div className="border-b border-gray-300 px-4 py-4">
        <h2 className="text-2xl font-semibold">Mensagens</h2>
        <div className="mt-3 flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-3">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Busque por produto ou usuário"
            className="h-full w-full bg-transparent text-[12px] text-gray-900 outline-none placeholder:text-gray-500"
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

