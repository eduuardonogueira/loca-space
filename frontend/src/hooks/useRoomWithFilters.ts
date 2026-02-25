"use client";

import {
  addFavorite,
  getFavoriteRoomsWithFilters,
  getRoomsWithFilters,
  removeFavorite,
} from "@/services";
import { IRoomWithAmenities } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface IFilterRange {
  max: number | null;
  min: number | null;
}

const DEFAULT_RANGE_VALUE = {
  max: null,
  min: null,
};

export function useRoomsWithFilters(page: "rooms" | "favorites") {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomWithAmenities[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [size, setSize] = useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [price, setPrice] = useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [totalSpace, setTotalSpace] =
    useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [amenitieIds, setAmenitieIds] = useState<number[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);

    const searchParams = {
      address,
      maxSize: size?.max,
      minSize: size?.min,
      maxPrice: price?.max,
      minPrice: price?.min,
      maxTotalSpace: totalSpace?.max,
      minTotalSpace: totalSpace?.min,
      amenities: amenitieIds,
      orderBy,
    };

    try {
      const response = await (page === "rooms"
        ? getRoomsWithFilters(searchParams)
        : getFavoriteRoomsWithFilters(searchParams));

      setRooms(response);
    } catch (error) {
      toast.error("Erro ao buscar salas");
      console.error("Erro ao buscar salas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [size, orderBy, price, totalSpace, address, amenitieIds]);

  function handleClearFilters() {
    setAddress(null);
    setOrderBy(null);
    setSize(DEFAULT_RANGE_VALUE);
    setPrice(DEFAULT_RANGE_VALUE);
    setTotalSpace(DEFAULT_RANGE_VALUE);
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

  const hasFilters =
    !!address ||
    !!orderBy ||
    size.min !== null ||
    size.max !== null ||
    price.min !== null ||
    price.max !== null ||
    totalSpace.min !== null ||
    totalSpace.max !== null;

  return {
    rooms,
    isLoading,
    fetchRooms,
    size,
    orderBy,
    price,
    address,
    totalSpace,
    amenitieIds,
    setSize,
    setOrderBy,
    setTotalSpace,
    setPrice,
    setAddress,
    handleClearFilters,
    hasFilters,
    setAmenitieIds,
    handleToggleFavorites,
  };
}

