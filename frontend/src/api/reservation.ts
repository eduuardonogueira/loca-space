"use server";

import { Reservation } from "@/types/reservation";
import { authFetch } from "./authFetch";
import { BASE_URL } from "./api";

export async function fetchReservations(): Promise<Reservation[] | null> {
  try {
    const response = await authFetch(`${BASE_URL}/appointments`, { 
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("Erro ao buscar reservas:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return null;
  }
}

export async function createReservation(
  reservationData: Omit<Reservation, "id">
): Promise<Reservation | null> {
  try {
    const response = await authFetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao criar reserva:", errorData);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return null;
  }
}

export async function deleteReservation(id: number): Promise<boolean> {
  try {
    const response = await authFetch(`${BASE_URL}/appointments/${id}`, { 
      method: "DELETE" 
    });

    if (!response.ok) {
      console.error(`Erro ao deletar reserva ${id}:`, response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erro ao deletar reserva ${id}:`, error);
    return false;
  }
}