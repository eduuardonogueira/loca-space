"use client";

import { addFavorite, getRooms, removeFavorite } from "@/services";
import { IRoomWithAmenities } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useRooms() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomWithAmenities[]>([]);

  async function fetchRooms() {
    setIsLoading(true);
    try {
      const response = await getRooms();

      if (response) {
        setRooms(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar salas");
      console.error("Erro ao buscar salas:", error);
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

