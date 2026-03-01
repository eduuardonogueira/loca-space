"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { MessagesSidebar } from "./MessagesSidebar.component";
import { MessagesChatHeader } from "./MessagesChatHeader.component";
import { MessagesSafetyNotice } from "./MessagesSafetyNotice.component";
import { MessagesComposer } from "./MessagesComposer.component";
import { MessageBubble } from "./MessageBubble.component";
import { ChatSocketProvider } from "@/providers/ChatSocketProvider";
import { useChat } from "@/hooks/useChat";
import { getProfile } from "@/services/auth";

function MessagesContent() {
  const {
    conversations,
    messages,
    selectedConversationId,
    isLoadingConversations,
    isLoadingMessages,
    isTyping,
    selectConversation,
    sendMessage,
    emitTyping,
  } = useChat();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) setCurrentUserId(profile.id);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      selectConversation(conversations[0].id);
    }
  }, [conversations, selectedConversationId, selectConversation]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f4f6] px-3 py-4 md:px-5">
      <div className="mx-auto h-[calc(100vh-115px)] max-w-400 overflow-hidden rounded-[6px] border border-[#d9d9d9] bg-white">
        <div className="flex h-full max-[980px]:flex-col">
          <MessagesSidebar
            conversations={conversations}
            selectedConversationId={selectedConversationId ?? 0}
            onSelectConversation={selectConversation}
            isLoading={isLoadingConversations}
          />

          <section className="flex flex-1 flex-col min-h-0">
            {selectedConversation ? (
              <>
                <MessagesChatHeader
                  conversation={selectedConversation}
                  isTyping={isTyping}
                />

                <div className="flex flex-1 flex-col bg-[#f3f3f3] px-6 py-5 max-[980px]:px-4 overflow-y-auto">
                  {isLoadingMessages ? (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-[13px] text-[#999]">
                        Carregando mensagens...
                      </p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-end">
                      <MessagesSafetyNotice />
                      <p className="mt-4 text-[13px] text-[#999]">
                        Nenhuma mensagem ainda. Envie a primeira!
                      </p>
                    </div>
                  ) : (
                    <>
                      <MessagesSafetyNotice />
                      <div className="mt-4 flex-1">
                        {messages.map((msg) => (
                          <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === currentUserId}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-[#e5e5e5] bg-white px-6 py-3">
                  <MessagesComposer onSend={handleSend} onTyping={emitTyping} />
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[14px] text-[#999]">
                  {isLoadingConversations
                    ? "Carregando conversas..."
                    : "Selecione uma conversa para começar"}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export function MessagesPageView() {
  return (
    <ChatSocketProvider>
      <MessagesContent />
    </ChatSocketProvider>
  );
}
