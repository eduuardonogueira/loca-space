"use server";

import { IAmenity } from "@/types/room";
import { authFetch } from "./authFetch";

export async function getAmenities(): Promise<IAmenity[] | null> {
  try {
    const response = await authFetch("/amenities", {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar amenities:", error);
    return null;
  }
}

