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

export enum EnumUserGender {
  MALE = "masculino",
  FEMALE = "feminino",
  OTHERS = "outros",
}

export type UserRole = "user" | "gerente" | "admin";
export type UserType = "cliente" | "locador";
export type UserGender = "masculino" | "feminino" | "outros";

export const UserTypeLabels: Record<EnumUserType, string> = {
  [EnumUserType.CLIENT]: "Cliente",
  [EnumUserType.OWNER]: "Locador",
};

export const UserGenderLabels: Record<EnumUserGender, string> = {
  [EnumUserGender.MALE]: "Masculino",
  [EnumUserGender.FEMALE]: "Feminino",
  [EnumUserGender.OTHERS]: "Outros",
};

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
  gender: UserGender | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  rooms: IRoom[];
  address: IAddress;
  favorites: IFavorite[];
  appointments: any[];
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: UserGender;
  birthDate: Date;
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

