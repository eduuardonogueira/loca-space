import { getRoomDetails } from "@/api";
import { IRoomDetails } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useRoomDetails(roomId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<IRoomDetails | null>(null);

  async function fetchRoomDetails() {
    setIsLoading(true);
    try {
      const response = await getRoomDetails(roomId);

      if (response) {
        setRoomDetails(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar salas");
      console.error("Erro ao buscar salas:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  return { roomDetails, isLoading, fetchRoomDetails };
}

