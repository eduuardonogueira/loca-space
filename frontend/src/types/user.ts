import { IRoom } from "./room";

export enum EnumUserRole {
  USER = "user",
  ADMIN = "admin",
}

export type UserRole = "user" | "admin";
export type UserType = "externo" | "interno";

export interface IFavorite {
  id: number;
  createdAt: string;
  room: IRoom;
}

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  type: UserType;
  role: UserRole;
  createdAt: string;
  updatedAt: string | null;
  profile: IProfile;
  rooms: IRoom[];
  favorites: IFavorite[];
  appointments: any[];
}
export interface IProfile {
  id: number;
  avatarUrl: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  neighborhood: string;
  state: string;
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
}

export interface ICreateUser {
  fullName: string;
  email: string;
}

