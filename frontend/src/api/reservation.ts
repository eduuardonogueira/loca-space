"use server";

import { Reservation } from "@/types/reservation";
import { authFetch } from "./authFetch";

interface ApiAmenity {
  id?: number;
  name?: string;
}

interface ApiAddress {
  id?: number;
  street?: string;
  number?: string;
  complement?: string;
  bairro?: string;
  city?: string;
  state?: string;
}

interface ApiRoom {
  id?: number;
  name?: string;
  imageUrl?: string | null;
  address?: ApiAddress;
  totalSpace?: number;
  size?: number;
  price?: number;
  parkingSlots?: number;
  amenities?: ApiAmenity[];
}

interface ApiAppointment {
  id?: number;
  order?: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  date?: string;
  startTime?: string;
  endTime?: string;
  details?: string | null;
  title?: string;
  userId?: number;
  roomId?: number;
  user?: { id?: number };
  room?: ApiRoom;
}

export interface CreateReservationResult {
  reservation: Reservation | null;
  errorStatus?: number;
}

interface ApiRoomDetailsResponse {
  room?: ApiRoom;
}

async function fetchFirstSuccessfulReservationPath(
  paths: string[],
  options: RequestInit
): Promise<Response | null> {
  for (const path of paths) {
    try {
      const response = await authFetch(path, options);
      if (response.ok) return response;
    } catch {
      // tenta próximo path
    }
  }

  return null;
}

async function fetchFirstReservationPath(
  paths: string[],
  options: RequestInit
): Promise<Response | null> {
  for (const path of paths) {
    try {
      const response = await authFetch(path, options);
      if (response.status !== 404) return response;
    } catch {
      // tenta próximo path
    }
  }

  return null;
}

function formatTime(time?: string): string {
  if (!time) return "";
  return time.length >= 5 ? time.slice(0, 5) : time;
}

function mapAppointmentToReservation(
  appointment: ApiAppointment,
): Reservation | null {
  if (!appointment.id) return null;

  const roomId = appointment.roomId ?? appointment.room?.id ?? 0;
  const roomAmenities = Array.isArray(appointment.room?.amenities)
    ? appointment.room.amenities
        .filter((amenity) => amenity?.id && amenity?.name)
        .map((amenity) => ({
          id: amenity.id as number,
          name: amenity.name as string,
        }))
    : [];

  const reservation: Reservation = {
    id: appointment.id,
    order: appointment.order ?? appointment.id,
    status: appointment.status ?? "PENDING",
    date: appointment.date ?? "",
    startTime: formatTime(appointment.startTime),
    endTime: formatTime(appointment.endTime),
    details: appointment.details ?? "",
    title: appointment.title ?? appointment.room?.name ?? "Reserva",
    userId: appointment.userId ?? appointment.user?.id ?? 0,
    roomId,
    room: appointment.room
      ? {
          id: roomId,
          name: appointment.room.name,
          imageUrl: appointment.room.imageUrl ?? null,
          address: appointment.room.address,
          totalSpace: appointment.room.totalSpace,
          size: appointment.room.size,
          price: appointment.room.price,
          parkingSlots: appointment.room.parkingSlots,
          amenities: roomAmenities,
        }
      : undefined,
  };

  return reservation;
}

async function fetchRoomDetailsSnapshot(
  roomId: number,
): Promise<ApiRoom | null> {
  if (!roomId) return null;

  const response = await fetchFirstSuccessfulReservationPath(
    [`/room/${roomId}/details`, `/rooms/${roomId}/details`],
    { method: "GET" },
  );

  if (!response) return null;

  const data = (await response.json()) as ApiRoomDetailsResponse;
  return data?.room ?? null;
}

async function enrichReservationsWithRoomDetails(
  reservations: Reservation[],
): Promise<Reservation[]> {
  const uniqueRoomIds = [...new Set(reservations.map((r) => r.roomId))].filter(
    (roomId) => roomId > 0,
  );

  const roomDetailsEntries = await Promise.all(
    uniqueRoomIds.map(async (roomId) => {
      try {
        const details = await fetchRoomDetailsSnapshot(roomId);
        return [roomId, details] as const;
      } catch {
        return [roomId, null] as const;
      }
    }),
  );

  const roomDetailsById = new Map<number, ApiRoom | null>(roomDetailsEntries);

  return reservations.map((reservation) => {
    const detailedRoom = roomDetailsById.get(reservation.roomId);
    if (!detailedRoom) return reservation;

    const detailedAmenities = Array.isArray(detailedRoom.amenities)
      ? detailedRoom.amenities
          .filter((amenity) => amenity?.id && amenity?.name)
          .map((amenity) => ({
            id: amenity.id as number,
            name: amenity.name as string,
          }))
      : [];

    return {
      ...reservation,
      room: {
        id: reservation.roomId,
        name: detailedRoom.name ?? reservation.room?.name ?? reservation.title,
        imageUrl: detailedRoom.imageUrl ?? reservation.room?.imageUrl ?? null,
        address: detailedRoom.address ?? reservation.room?.address,
        totalSpace: detailedRoom.totalSpace ?? reservation.room?.totalSpace,
        size: detailedRoom.size ?? reservation.room?.size,
        price: detailedRoom.price ?? reservation.room?.price,
        parkingSlots: detailedRoom.parkingSlots ?? reservation.room?.parkingSlots,
        amenities:
          detailedAmenities.length > 0
            ? detailedAmenities
            : reservation.room?.amenities,
      },
    };
  });
}

export async function fetchReservations(): Promise<Reservation[] | null> {
  try {
    const meResponse = await authFetch("/user/me", { method: "GET" });
    if (meResponse.ok) {
      const meData = await meResponse.json();
      const appointments = Array.isArray(meData?.appointments)
        ? meData.appointments
        : [];

      const mappedReservations = appointments
        .map((appointment: ApiAppointment) =>
          mapAppointmentToReservation(appointment),
        )
        .filter((reservation: Reservation | null): reservation is Reservation =>
          Boolean(reservation),
        );

      return enrichReservationsWithRoomDetails(mappedReservations);
    }

    const appointmentsResponse = await fetchFirstSuccessfulReservationPath(
      ["/appointment", "/appointments"],
      { method: "GET" }
    );

    if (!appointmentsResponse) {
      return null;
    }

    const profileResponse = await authFetch("/auth/profile", { method: "GET" });
    const currentUserId = profileResponse.ok
      ? ((await profileResponse.json())?.id as number | undefined)
      : undefined;

    const appointmentsData = await appointmentsResponse.json();
    const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];

    const mappedReservations = appointments
      .map((appointment: ApiAppointment) =>
        mapAppointmentToReservation(appointment),
      )
      .filter((reservation: Reservation | null): reservation is Reservation =>
        Boolean(reservation),
      )
      .filter((reservation) =>
        currentUserId ? reservation.userId === currentUserId : true,
      );

    return enrichReservationsWithRoomDetails(mappedReservations);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return null;
  }
}

export async function createReservation(
  reservationData: Omit<Reservation, "id">
): Promise<CreateReservationResult> {
  try {
    const response = await fetchFirstReservationPath(
      ["/appointment", "/appointments"],
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      }
    );

    if (!response) {
      return { reservation: null, errorStatus: 0 };
    }

    if (!response.ok) {
      return { reservation: null, errorStatus: response.status };
    }

    const appointment = (await response.json()) as ApiAppointment;
    return { reservation: mapAppointmentToReservation(appointment) };
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return { reservation: null, errorStatus: 0 };
  }
}

export async function deleteReservation(id: number): Promise<boolean> {
  try {
    const response = await fetchFirstSuccessfulReservationPath(
      [`/appointment/${id}`, `/appointments/${id}`],
      { method: "DELETE" }
    );

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erro ao deletar reserva ${id}:`, error);
    return false;
  }
}
