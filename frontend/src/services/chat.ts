"use server";

import { authFetch } from "./authFetch";
import { AUTH_COOKIE_KEY } from "@/constants/cookies";
import { cookies } from "next/headers";

export async function getConversations() {
  try {
    const resposta = await authFetch("/chat/conversations", {
      method: "GET",
    });

    if (!resposta.ok) {
      console.error("Erro ao buscar conversas:", resposta.status);
      return [];
    }

    return resposta.json();
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return [];
  }
}

export async function createConversation(targetUserId: number, roomId: number) {
  try {
    const resposta = await authFetch("/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, roomId }),
    });

    if (!resposta.ok) {
      const errorData = await resposta.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || "Erro ao criar conversa",
      };
    }

    const data = await resposta.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    return { success: false, error: "Erro ao criar conversa" };
  }
}

export async function getMessages(
  conversationId: number,
  page: number = 1,
  limit: number = 50,
) {
  try {
    const response = await authFetch(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      { method: "GET" },
    );

    if (!response.ok) {
      console.error("Erro ao buscar mensagens:", response.status);
      return { data: [], total: 0, page: 1, limit: 50, totalPages: 0 };
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return { data: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  }
}

export async function markAsRead(conversationId: number) {
  try {
    const response = await authFetch(
      `/chat/conversations/${conversationId}/read`,
      { method: "PATCH" },
    );

    return response.ok;
  } catch (error) {
    console.error("Erro ao marcar como lida:", error);
    return false;
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    //pegando o biscoito setado
    const biscoitinho = await cookies();
    return biscoitinho.get(AUTH_COOKIE_KEY)?.value ?? null;
  } catch {
    return null;
  }
}
