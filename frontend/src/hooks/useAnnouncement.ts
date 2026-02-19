import { getRooms, getRoomsByUser } from "@/api";
import { IRoomWithAmenities } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useAnnouncement() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomWithAmenities[]>([]);

  async function fetchRooms() {
    setIsLoading(true);
    try {
      const response = await getRoomsByUser();

      if (response) {
        setRooms(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar salas");
      console.error("Erro ao buscar perfil do usuário:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, isLoading, fetchRooms };
}

