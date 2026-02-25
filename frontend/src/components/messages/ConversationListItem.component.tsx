"use client";

import { ConversationPreview } from "./types";

interface ConversationListItemProps {
  conversation: ConversationPreview;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full border-b border-[#e3e3e3] px-3 py-3 text-left transition ${
        isSelected ? "bg-[#ededed]" : "bg-white hover:bg-[#f8f8f8]"
      }`}
    >
      {conversation.unreadCount && conversation.unreadCount > 0 ? (
        <span className="absolute left-1.5 top-3.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f04438] px-1 text-[9px] font-bold text-white">
          {conversation.unreadCount}
        </span>
      ) : null}

      <div className="flex items-start gap-2.5">
        <div className="relative ml-4 h-11 w-11 overflow-hidden rounded-full border border-[#e5e5e5]">
          <img
            src={conversation.userAvatarUrl}
            alt={conversation.userName}
            className="h-full w-full object-cover"
          />
          {conversation.online ? (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-[#1f1f1f]">
            {conversation.roomTitle}
          </p>
          <p className="truncate text-[11px] text-[#373737]">{conversation.userName}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="truncate text-[10px] text-[#a8a8a8]">
              {conversation.lastMessage}
            </p>
            <p className="ml-2 text-[10px] text-[#f16161]">
              {conversation.lastMessageAt}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
