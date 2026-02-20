import { IAddress, IRoom } from "./room";

export enum EnumUserRole {
  USER = "user",
  ADMIN = "admin",
}

export type UserRole = "user" | "admin";

export interface IFavorite {
  id: number;
  createdAt: string;
  room: IRoom;
}

export interface IUser {
  id: number;
  fullName: string;
  avatarUrl: string;
  email: string;
  role: UserRole;
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  rooms: IRoom[];
  address: IAddress;
  favorites: IFavorite[];
  appointments: any[];
}

export interface ICreateUser {
  fullName: string;
  email: string;
}

