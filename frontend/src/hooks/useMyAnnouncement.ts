import {
  addFavorite,
  getRooms,
  getRoomsByUser,
  removeFavorite,
} from "@/services";
import { IRoomWithAmenities } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useMyAnnouncement() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomWithAmenities[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [amenitieIds, setAmenitieIds] = useState<number[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);

    const searchParams = {
      name,
      status,
      type,
      amenities: amenitieIds,
      orderBy,
    };

    try {
      const response = await getRoomsByUser(searchParams);

      setRooms(response);
    } catch (error) {
      toast.error("Erro ao buscar meus anúncios");
      console.error("Erro ao buscar meus anúncios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [name, status, orderBy, type, amenitieIds]);

  function handleClearFilters() {
    setName(null);
    setStatus(null);
    setType(null);
    setOrderBy(null);
    setAmenitieIds([]);
  }

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

  const hasFilters = !!name || !!orderBy || !!status || !!type;

  return {
    rooms,
    isLoading,
    fetchRooms,
    type,
    setType,
    name,
    status,
    setName,
    setStatus,
    orderBy,
    amenitieIds,
    setOrderBy,
    handleClearFilters,
    hasFilters,
    setAmenitieIds,
    handleToggleFavorites,
  };
}

