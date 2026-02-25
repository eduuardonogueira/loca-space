import { getAmenities } from "@/services";
import { IAmenity } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useAmenities() {
  const [isLoading, setIsLoading] = useState(false);
  const [amenities, setAmenities] = useState<IAmenity[]>([]);

  async function fetchAmenities() {
    setIsLoading(true);
    try {
      const response = await getAmenities();

      if (response) {
        setAmenities(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar recursos");
      console.error("Erro ao buscar recursos:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchAmenities();
  }, []);

  return { amenities, isLoading, fetchAmenities };
}

