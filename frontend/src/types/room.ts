import { IAppointment } from "./appointment";
import { IAvailability } from "./availability";

export type RoomStatus = "available" | "scheduled" | "maintenance";
export type RoomType = "room" | "laboratory" | "maintenance";

export interface IAmenity {
  id: number;
  name: string;
}

export enum EnumRoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "scheduled",
  MAINTENANCE = "maintenance",
}

export type IRoomStatus = "available" | "unavailable" | "maintenance";

export interface IAddress {
  id: number;
  street: string;
  number: string;
  complement: string;
  bairro: string;
  city: string;
  state: string;
}

export interface IRoom {
  id: number;
  userId: number;
  name: string;
  size: number;
  totalSpace: number;
  price: number;
  status: IRoomStatus;
  description: string;
  imageUrl: string;
  isFavorite: boolean;
  parkingSlots: number;
  createdAt: string;
  updatedAt: string | null;
  type: RoomType;
  address: IAddress;
}

export type IRoomWithAmenities = IRoom & {
  amenities: {
    id: number;
    name: string;
  }[];
};

export interface ICreateRoom {
  name: string;
  location: string;
  capacity: number;
  duration: number;
  description: string;
  status: RoomStatus;
  type: RoomType;
  imageUrl?: string;
  amenities?: number[];
}

export interface IAdvertise {
  name: string;
  email: string;
  phone: string;
}

export interface IRoomDetails {
  room: IRoomWithAmenities & { advertise: IAdvertise };
  availability: IAvailability[];
  appointments: IAppointment[];
}

