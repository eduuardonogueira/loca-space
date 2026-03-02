import { getAppointmentsByUser } from "@/services/appointments";
import { IAppointmentWithRoomAndUser } from "@/types/appointment";
import { IAmenity } from "@/types/room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useReservations() {
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<
    IAppointmentWithRoomAndUser[] | null
  >(null);

  async function fetchReservations() {
    setIsLoading(true);
    try {
      const response = await getAppointmentsByUser();

      if (response) {
        setReservations(response);
      }
    } catch (error) {
      toast.error("Erro ao buscar reservas");
      console.error("Erro ao buscar reservas:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  return { reservations, isLoading, fetchReservations };
}

