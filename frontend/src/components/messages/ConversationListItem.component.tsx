"use client";

import { ConversationPreview } from "@/types/messages";

interface ConversationListItemProps {
  conversation: ConversationPreview;
  isSelected: boolean;
  onClick: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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
      className={`relative w-full border-b border-gray-200 px-3 py-3 text-left transition ${
        isSelected ? "bg-gray-200" : "bg-white hover:bg-gray-50"
      }`}
    >
      {conversation.unreadCount > 0 ? (
        <span className="absolute left-1.5 top-3.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
          {conversation.unreadCount}
        </span>
      ) : null}

      <div className="flex items-start gap-2.5">
        <div className="relative ml-4 h-11 w-11 overflow-hidden rounded-full border border-gray-200">
          {conversation.userAvatarUrl ? (
            <img
              src={conversation.userAvatarUrl}
              alt={conversation.userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[14px] font-semibold text-gray-500">
              {getInitials(conversation.userName)}
            </div>
          )}
          {conversation.online ? (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {conversation.room?.name ?? conversation.userName}
          </p>
          <p className="truncate text-xs text-gray-700">
            {conversation.userName}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="truncate text-[11px] text-gray-400">
              {conversation.lastMessage ?? "Sem mensagens"}
            </p>
            {conversation.lastMessageAt && (
              <p className="ml-2 text-[11px] text-red-400">
                {conversation.lastMessageAt}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
