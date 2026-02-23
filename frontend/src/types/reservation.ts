
import { IAmenity, IAddress } from "./room";

export interface ReservationRoomSnapshot {
  id: number;
  name?: string;
  imageUrl?: string | null;
  address?: Partial<IAddress>;
  totalSpace?: number;
  size?: number;
  price?: number;
  parkingSlots?: number;
  amenities?: IAmenity[];
}

export interface Reservation {
  id: number;
  order: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  title: string;
  userId: number;
  roomId: number;
  room?: ReservationRoomSnapshot;
}
