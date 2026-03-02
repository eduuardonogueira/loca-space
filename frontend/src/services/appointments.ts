"use server";

import { CreateAppointmentPayload } from "./../types/appointment";
import { authFetch } from "./authFetch";

export async function createAppointment(
  appointmentData: CreateAppointmentPayload,
) {
  const response = await authFetch("/appointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  return response.json();
}

export async function getAppointmentsByUser() {
  const response = await authFetch(`/appointment/user`, {
    method: "GET",
  });
  return response.json();
}

export async function deleteAppointment(
  appointmentId: number,
): Promise<boolean> {
  try {
    const response = await authFetch(`/appointment/${appointmentId}`, {
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

