"use server";

import { ICreateRoom, IRoomWithAmenities } from "@/types/room";
import { authFetch } from "./authFetch";

export async function getRooms(): Promise<IRoomWithAmenities[] | null> {
  try {
    const response = await authFetch("/room", {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return null;
  }
}

export async function getRoomsByUser(): Promise<IRoomWithAmenities[] | null> {
  try {
    const response = await authFetch("/room", {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return null;
  }
}

export async function createRoom(
  roomData: ICreateRoom,
): Promise<IRoomWithAmenities[] | null> {
  try {
    const response = await authFetch("/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return null;
  }
}

export async function updateRoom(
  roomData: Partial<ICreateRoom>,
  roomId: number,
): Promise<IRoomWithAmenities[] | null> {
  try {
    const response = await authFetch(`/room/${roomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return null;
  }
}

export async function deleteRoom(roomId: number): Promise<boolean> {
  try {
    const response = await authFetch(`/room/${roomId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return false;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return false;
  }
}

