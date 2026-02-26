"use client";

import { ConversationPreview } from "@/types/messages";
import { ProfileModal } from "../ProfileModal.component";
import { useState } from "react";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";

interface MessagesChatHeaderProps {
  conversation: ConversationPreview;
}

export function MessagesChatHeader({ conversation }: MessagesChatHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, isLoading } = useGetUserProfile(conversation.userId);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <header
        className="
        flex h-26.5 items-center justify-between border-b
         border-gray-300 bg-white px-6 
         max-[700px]:h-auto max-[700px]:flex-col 9
         max-[700px]:items-start max-[700px]:gap-3
         max-[700px]:py-3
      "
      >
        <div className="flex items-center gap-4">
          <div className="h-17.5 w-36.5 overflow-hidden rounded-xl border border-gray-300">
            <img
              src={conversation.roomImageUrl}
              alt={conversation.roomTitle}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl text-gray-800 font-semibold">
              {conversation.roomTitle}
            </h3>
            <p className="mt-1 text-md font-semibold text-red-500">
              R$ {conversation.roomPrice.toLocaleString("pt-BR")}
            </p>
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
        isOpen={isOpen}
        onClose={onClose}
        profile={profile}
        isLoading={isLoading}
      />
    </>
  );
}

