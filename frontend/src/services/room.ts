"use server";

import {
  CreateRoomPayload,
  IAnnouncesWithFiltersParams,
  ICreateRoom,
  IRoomDetails,
  IRoomWithAmenities,
  IRoomWithFiltersParams,
} from "@/types/room";
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

export async function getRoomsWithFilters({
  address,
  maxSize,
  minSize,
  maxPrice,
  minPrice,
  maxTotalSpace,
  minTotalSpace,
  amenities,
  orderBy,
}: IRoomWithFiltersParams): Promise<IRoomWithAmenities[]> {
  const params = new URLSearchParams();

  if (address) params.append("address", address);
  if (minSize !== null) params.append("minSize", minSize.toString());
  if (maxSize !== null) params.append("maxSize", maxSize.toString());
  if (minPrice !== null) params.append("minPrice", minPrice.toString());
  if (maxPrice !== null) params.append("maxPrice", maxPrice.toString());
  if (maxTotalSpace !== null)
    params.append("maxTotalSpace", maxTotalSpace.toString());
  if (minTotalSpace !== null)
    params.append("minTotalSpace", minTotalSpace.toString());
  if (amenities.length > 0) params.append("amenities", amenities.join(","));
  if (orderBy) params.append("orderBy", orderBy);

  const queryString = params.toString();

  try {
    const response = await authFetch(`/room/filter?${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return [];
  }
}

export async function getFavoriteRoomsWithFilters({
  address,
  maxSize,
  minSize,
  maxPrice,
  minPrice,
  maxTotalSpace,
  minTotalSpace,
  amenities,
  orderBy,
}: IRoomWithFiltersParams): Promise<IRoomWithAmenities[]> {
  const params = new URLSearchParams();

  if (address) params.append("address", address);
  if (minSize !== null) params.append("minSize", minSize.toString());
  if (maxSize !== null) params.append("maxSize", maxSize.toString());
  if (minPrice !== null) params.append("minPrice", minPrice.toString());
  if (maxPrice !== null) params.append("maxPrice", maxPrice.toString());
  if (maxTotalSpace !== null)
    params.append("maxTotalSpace", maxTotalSpace.toString());
  if (minTotalSpace !== null)
    params.append("minTotalSpace", minTotalSpace.toString());
  if (amenities.length > 0) params.append("amenities", amenities.join(","));
  if (orderBy) params.append("orderBy", orderBy);

  const queryString = params.toString();

  try {
    const response = await authFetch(`/favorites?${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return [];
  }
}

export async function getRoomDetails(
  roomId: number,
): Promise<IRoomDetails | null> {
  try {
    const response = await authFetch(`/room/${roomId}/details`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar detalhes da sala:", error);
    return null;
  }
}

export async function getRoomsByUser({
  name,
  status,
  type,
  orderBy,
  amenities,
}: IAnnouncesWithFiltersParams): Promise<IRoomWithAmenities[] | []> {
  const params = new URLSearchParams();

  if (name) params.append("name", name);
  if (status) params.append("status", status);
  if (type) params.append("type", type);
  if (amenities.length > 0) params.append("amenities", amenities.join(","));
  if (orderBy) params.append("orderBy", orderBy);

  const queryString = params.toString();

  try {
    const response = await authFetch(`/room/my-rooms?${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar rooms:", error);
    return [];
  }
}

export async function createRoom(data: CreateRoomPayload) {
  try {
    const response = await authFetch("/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || "Erro ao criar sala",
      };
    }

    const room = await response.json();
    return { success: true, data: room };
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return { success: false, error: "Erro ao criar sala" };
  }
}

export async function uploadRoomBanner(roomId: number, formData: FormData) {
  try {
    const response = await authFetch(`/room/${roomId}/upload-banner`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: "Erro ao enviar banner" };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar banner:", error);
    return { success: false, error: "Erro ao enviar banner" };
  }
}

export async function uploadRoomPhotos(roomId: number, formData: FormData) {
  try {
    const response = await authFetch(`/room/${roomId}/upload-photos`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: "Erro ao enviar fotos" };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar fotos:", error);
    return { success: false, error: "Erro ao enviar fotos" };
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

export async function addFavorite(roomId: number): Promise<any> {
  try {
    const data = { roomId };
    const response = await authFetch(`/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return false;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao adicionar sala aos favoritos:", error);
    return false;
  }
}

export async function removeFavorite(roomId: number): Promise<any> {
  try {
    const response = await authFetch(`/favorite/${roomId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return false;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao remover sala aos favoritos:", error);
    return false;
  }
}

