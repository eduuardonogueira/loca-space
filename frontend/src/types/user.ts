export type UserRole = "user" | "admin";

export enum EnumUserRole {
  USER = "user",
  ADMIN = "admin",
}
export interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICreateUser {
  fullName: string;
  email: string;
}

