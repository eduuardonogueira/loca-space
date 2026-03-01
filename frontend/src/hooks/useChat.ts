"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChatSocket } from "@/providers/ChatSocketProvider";
import { getConversations, getMessages, markAsRead } from "@/services/chat";
import type {
  ConversationPreview,
  ChatMessage,
  RawConversation,
} from "@/types/messages";
import { formatTimeAgo } from "@/types/messages";

function mapConversation(raw: RawConversation): ConversationPreview {
  const participant = raw.participants[0];
  return {
    id: raw.conversationId,
    room: raw.room,
    userName: participant?.fullName ?? "Usuário",
    userAvatarUrl: participant?.avatarUrl ?? null,
    userId: participant?.userId ?? 0,
    lastMessage: raw.lastMessage?.content ?? null,
    lastMessageAt: raw.lastMessage
      ? formatTimeAgo(raw.lastMessage.createdAt)
      : null,
    unreadCount: raw.unreadCount,
  };
}

export function useChat() {
  const { socket } = useChatSocket();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const data = await getConversations();
      const mapped = (data as RawConversation[]).map(mapConversation);
      setConversations(mapped);
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: number) => {
    setIsLoadingMessages(true);
    try {
      const result = await getMessages(conversationId);
      const sorted = (result.data as ChatMessage[]).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setMessages(sorted);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback(
    async (conversationId: number) => {
      if (selectedConversationId && socket) {
        socket.emit("leaveConversation", {
          conversationId: selectedConversationId,
        });
      }

      setSelectedConversationId(conversationId);
      setMessages([]);

      if (socket) {
        socket.emit("joinConversation", { conversationId });
      }

      await loadMessages(conversationId);
      await markAsRead(conversationId);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    },
    [selectedConversationId, socket, loadMessages],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !selectedConversationId || !content.trim()) return;
      socket.emit("sendMessage", {
        conversationId: selectedConversationId,
        content: content.trim(),
      });
    },
    [socket, selectedConversationId],
  );

  const emitTyping = useCallback(() => {
    if (!socket || !selectedConversationId) return;
    socket.emit("typing", { conversationId: selectedConversationId });
  }, [socket, selectedConversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (
      message: ChatMessage & { conversationId: number },
    ) => {
      if (message.conversationId === selectedConversationId) {
        setMessages((prev) => [...prev, message]);
        markAsRead(message.conversationId);
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === message.conversationId) {
            return {
              ...c,
              lastMessage: message.content,
              lastMessageAt: "Agora",
              unreadCount:
                message.conversationId === selectedConversationId
                  ? 0
                  : c.unreadCount + 1,
            };
          }
          return c;
        }),
      );
    };

    const handleTyping = (data: { userId: number; conversationId: number }) => {
      if (data.conversationId === selectedConversationId) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    };

    const handleMessagesRead = (data: { conversationId: number }) => {
      if (data.conversationId === selectedConversationId) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, selectedConversationId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    selectedConversationId,
    isLoadingConversations,
    isLoadingMessages,
    isTyping,
    selectConversation,
    sendMessage,
    emitTyping,
    loadConversations,
  };
}
