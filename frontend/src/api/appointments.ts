"use server";

import { ICreateAppointment } from "@/types/appointment";
import { authFetch } from "./authFetch";
import { IRoomDetails } from "@/types/room";

export async function getRoomDetails(
  roomId: number,
): Promise<IRoomDetails | null> {
  try {
    const response = await authFetch(`/rooms/${roomId}/details`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição de detalhes da sala:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar detalhes de agendamento da sala:", error);
    return null;
  }
}

export async function createAppointment(
  appointmentData: ICreateAppointment,
): Promise<any[] | null> {
  try {
    const response = await authFetch(`/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      console.error("Erro ao criar agendamento:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return null;
  }
}

export async function deleteAppointment(
  appointmentId: number,
): Promise<boolean> {
  try {
    const response = await authFetch(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Erro ao deletar agendamento:", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return false;
  }
}

