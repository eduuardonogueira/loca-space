import { IAppointment } from "./appointment";
import { IAvailability } from "./availability";

export type RoomStatus = "available" | "scheduled" | "maintenance";
export type RoomType = "SalaReuniao" | "Escritorio" | "Gerais";

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
  bannerUrl: string;
  photoUrls: string[];
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

type RoomOmittedProps = "id" | "isFavorite";
export interface ICreateRoom extends Omit<IRoom, RoomOmittedProps> {}

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

export interface CreateRoomPayload {
  name: string;
  description: string;
  status: RoomStatus;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    bairro: string;
    city: string;
    state: string;
  };
  size: number;
  price: number;
  totalSpace: number;
  type: RoomType;
  amenities: number[];
}

export enum EnumRoomType {
  SalaReuniao = "SalaReuniao",
  Escritorio = "Escritorio",
  Gerais = "Gerais",
}

export const RoomTypeLabels: Record<EnumRoomType, string> = {
  [EnumRoomType.SalaReuniao]: "Sala de Reuniao",
  [EnumRoomType.Escritorio]: "Escritorio",
  [EnumRoomType.Gerais]: "Gerais",
};

