import { IRoom } from "./room";
import { IUser } from "./user";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export enum EnumAppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface CreateAppointmentPayload {
  status: AppointmentStatus;
  startDateTime: string;
  endDateTime: string;
  details: string;
  title: string;
  roomId: number;
  price: number;
  totalValue: number;
}

export interface IAppointment {
  id: number;
  status: AppointmentStatus;
  startDateTime: string;
  endDateTime: string;
  details: string;
  title: string;
  userId: number;
  roomId: number;
  price: number;
  totalValue: number;
}

export interface IAppointmentWithRoomAndUser extends IAppointment {
  user: IUser;
  room: IRoom;
}

