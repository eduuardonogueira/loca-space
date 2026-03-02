"use client";

import { ConversationPreview } from "@/types/messages";
import { ProfileModal } from "../ProfileModal.component";
import { useState } from "react";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";

interface MessagesChatHeaderProps {
  conversation: ConversationPreview;
  isTyping?: boolean;
}

export function MessagesChatHeader({
  conversation,
  isTyping,
}: MessagesChatHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, isLoading } = useGetUserProfile(conversation.userId);

  const roomName = conversation.room?.name ?? "Conversa";
  const roomPrice = conversation.room?.price;
  const roomImage = conversation.room?.bannerUrl;

  return (
    <>
      <header
        className="
        flex h-26.5 items-center justify-between border-b
         border-gray-300 bg-white px-6 
         max-[700px]:h-auto max-[700px]:flex-col 
         max-[700px]:items-start max-[700px]:gap-3
         max-[700px]:py-3
      "
      >
        <div className="flex items-center gap-4">
          {roomImage ? (
            <div className="h-17.5 w-36.5 overflow-hidden rounded-xl border border-gray-300">
              <img
                src={roomImage}
                alt={roomName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-17.5 w-36.5 items-center justify-center rounded-xl border border-gray-300 bg-gray-100">
              <span className="text-[20px] text-gray-400">🏢</span>
            </div>
          )}

          <div>
            <h3 className="text-xl text-gray-800 font-semibold">{roomName}</h3>
            {roomPrice != null && (
              <p className="mt-1 text-md font-semibold text-red-500">
                R$ {Number(roomPrice).toLocaleString("pt-BR")}
              </p>
            )}
            {isTyping && (
              <p className="mt-0.5 text-[11px] text-green-600 font-medium animate-pulse">
                digitando...
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-right transition hover:opacity-75"
        >
          <p className="text-md font-bold text-gray-800">
            {conversation.userName}
          </p>
          <p className="text-sm text-gray-700">Ver perfil</p>
        </button>
      </header>
      <ProfileModal
        type="message"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile}
        isLoading={isLoading}
      />
    </>
  );
}

