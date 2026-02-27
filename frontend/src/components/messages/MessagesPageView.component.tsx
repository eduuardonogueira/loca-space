"use client";

import { useMemo, useState } from "react";
import { MessagesSidebar } from "./MessagesSidebar.component";
import { MessagesChatHeader } from "./MessagesChatHeader.component";
import { MessagesSafetyNotice } from "./MessagesSafetyNotice.component";
import { MessagesComposer } from "./MessagesComposer.component";
import { MessagesUserProfileModal } from "./MessagesUserProfileModal.component";
import { ConversationPreview, MessageUserProfile } from "@/types/messages";
import { ProfileModal } from "../ProfileModal.component";

const DEMO_CONVERSATIONS: ConversationPreview[] = [
  {
    id: 1,
    roomTitle: "Sala Industrial - Condomínio",
    roomPrice: 850,
    roomImageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070&auto=format&fit=crop",
    userName: "Teodoro Teobaldo",
    userAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=870&auto=format&fit=crop",
    lastMessage: "Teodoro Teobaldo",
    lastMessageAt: "",
    online: true,
    userId: 8,
  },
  {
    id: 2,
    roomTitle: "Sala Comercial - Edifício Village",
    roomPrice: 790,
    roomImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    userName: "Fabrício Lima",
    userAvatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1170&auto=format&fit=crop",
    userId: 9,
    lastMessage: "Está disponível sim",
    lastMessageAt: "Agora",
    unreadCount: 1,
    online: true,
  },
];

export function MessagesPageView() {
  const [selectedConversationId, setSelectedConversationId] = useState(
    DEMO_CONVERSATIONS[0]?.id ?? 0,
  );
  const [messageDraft, setMessageDraft] = useState("");

  const selectedConversation = useMemo(
    () =>
      DEMO_CONVERSATIONS.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? DEMO_CONVERSATIONS[0],
    [selectedConversationId],
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f4f6] px-3 py-4 md:px-5">
      <div className="mx-auto h-[calc(100vh-115px)] max-w-400 overflow-hidden rounded-[6px] border border-[#d9d9d9] bg-white">
        <div className="flex h-full max-[980px]:flex-col">
          <MessagesSidebar
            conversations={DEMO_CONVERSATIONS}
            selectedConversationId={selectedConversation.id}
            onSelectConversation={setSelectedConversationId}
          />

          <section className="flex flex-1 flex-col min-h-0">
            <MessagesChatHeader conversation={selectedConversation} />

            <div className="flex flex-1 flex-col justify-end bg-[#f3f3f3] px-6 py-5 max-[980px]:px-4">
              <p className="mb-2 text-center text-[12px] text-[#9d9d9d]">
                Hoje
              </p>
              <MessagesSafetyNotice />
              <MessagesComposer
                value={messageDraft}
                onChange={setMessageDraft}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

