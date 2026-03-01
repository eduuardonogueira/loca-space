"use client";

import { Search } from "lucide-react";
import { ConversationListItem } from "./ConversationListItem.component";
import { ConversationPreview } from "@/types/messages";
import { useState, useMemo } from "react";

interface MessagesSidebarProps {
  conversations: ConversationPreview[];
  selectedConversationId: number;
  onSelectConversation: (id: number) => void;
  isLoading?: boolean;
}

export function MessagesSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}: MessagesSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const term = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.userName.toLowerCase().includes(term) ||
        c.room?.name?.toLowerCase().includes(term),
    );
  }, [conversations, search]);

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
            placeholder="Busque por sala ou usuário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full w-full bg-transparent text-[12px] text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-[13px] text-gray-400">Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-[13px] text-gray-400">
              {search.trim()
                ? "Nenhum resultado encontrado"
                : "Nenhuma conversa ainda"}
            </p>
          </div>
        ) : (
          filtered.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
