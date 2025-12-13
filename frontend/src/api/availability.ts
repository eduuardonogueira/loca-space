"use server";

import { authFetch } from "./authFetch";
import { IAvailability, ICreateAvailability } from "@/types/availability";

export async function getAvailabilityByRoom(
  roomId: number
): Promise<IAvailability[] | null> {
  try {
    const response = await authFetch(`/availability/room/${roomId}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar disponibilidade:", error);
    return null;
  }
}

export async function createAvailability(
  availabilityData: ICreateAvailability
): Promise<IAvailability[] | null> {
  try {
    const response = await authFetch("/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(availabilityData),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao criar disponibilidade:", error);
    return null;
  }
}

export async function updateAvailability(
  availabilityData: ICreateAvailability,
  availabilityId: number
): Promise<IAvailability[] | null> {
  try {
    const response = await authFetch(`/availability/${availabilityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(availabilityData),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao criar disponibilidade:", error);
    return null;
  }
}

export async function deleteAvailability(
  availabilityId: number
): Promise<boolean> {
  try {
    const response = await authFetch(`/availability/${availabilityId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao deletar disponibilidade:", error);
    return false;
  }
}

