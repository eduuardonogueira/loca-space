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

export enum EnumRoomType {
  ROOM = "room",
  LABORATORY = "laboratory",
}

export interface IRoom {
  id: number;
  name: string;
  location: string;
  capacity: number;
  duration: number;
  description: string;
  status: RoomStatus;
  type: RoomType;
  imageUrl?: string;
  price: number;
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

export interface IRoomDetails {
  room: IRoomWithAmenities;
  availability: IAvailability[];
  appointments: IAppointment[];
}

