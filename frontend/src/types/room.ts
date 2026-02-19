import { IAppointment } from "./appointment";
import { IAvailability } from "./availability";

export type RoomStatus = "available" | "scheduled" | "maintenance" | string;
export type RoomType = "room" | "laboratory" | "maintenance" | "SalaReuniao" | string;

export interface IAmenity {
  id: number;
  name: string;
}

export interface IAddress {
  id?: number;
  street: string;
  number: string;
  complement: string;
  bairro: string;
  city: string;
  state: string;
}

export enum EnumRoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "scheduled",
  MAINTENANCE = "maintenance",
}

export enum EnumRoomType {
  ROOM = "room",
  LABORATORY = "laboratory",
}

export interface IRoom {
  id: number;
  userId: number;
  name: string;
  size: number;
  address: IAddress;
  totalSpace: number;
  price: number;
  status: RoomStatus;
  description: string;
  imageUrl: string;
  parkingSlots: number;
  createdAt?: string;
  updatedAt?: string;
  type: RoomType;
}

export type IRoomWithAmenities = IRoom & {
  amenities: IAmenity[];
};

export interface ICreateRoom {
  name: string;
  totalSpace: number;
  price: number;
  size: number;
  address: Omit<IAddress, "id">; 
  status: RoomStatus;
  description: string;
  imageUrl: string;
  parkingSlots: number;
  type: RoomType;
  amenities: number[]; 
}

export interface IRoomDetails {
  room: IRoomWithAmenities;
  availability: IAvailability[];
  appointments: IAppointment[];
}