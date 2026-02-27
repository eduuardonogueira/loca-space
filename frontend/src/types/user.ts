import { IAddress, IRoom } from "./room";

export enum EnumUserRole {
  USER = "user",
  MANAGER = "gerente",
  ADMIN = "admin",
}

export enum EnumUserType {
  CLIENT = "cliente",
  OWNER = "locador",
}

export type UserRole = "user" | "gerente" | "admin";
export type UserType = "cliente" | "locador";

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
  password: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  type: UserType;
  role: UserRole;
  address: {
    street: string;
    number?: string;
    complement?: string;
    bairro: string;
    city: string;
    state: string;
  };
}
