"use client";

import {
  addFavorite,
  getMostFavoriteRooms,
  getRooms,
  removeFavorite,
} from "@/services";
import { IRoomWithAmenities } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useMostFavoriteRooms() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomWithAmenities[]>([]);

  async function fetchRooms() {
    setIsLoading(true);
    try {
      const response = await getMostFavoriteRooms(1, 6);

      if (response) {
        setRooms(response.data);
      }
    } catch (error) {
      toast.error("Erro ao buscar salas mais populares");
      console.error("Erro ao buscar salas mais populares:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  async function handleToggleFavorites(selectedRoom: IRoomWithAmenities) {
    if (selectedRoom.isFavorite) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id ? { ...room, isFavorite: false } : room,
        ),
      );
      await removeFavorite(selectedRoom.id);
    } else {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id ? { ...room, isFavorite: true } : room,
        ),
      );
      await addFavorite(selectedRoom.id);
    }
  }

  return { rooms, isLoading, fetchRooms, handleToggleFavorites };
}

