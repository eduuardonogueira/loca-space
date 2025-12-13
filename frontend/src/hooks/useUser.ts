import { IUser } from "@/types/user";

export function useUser() {
  const defaultUser: IUser = {
    id: 1,
    fullName: "Usuário Normal",
    email: "user@user.com",
    type: "discente",
    role: "user",
    createdAt: new Date(),
  };

  const adminUser: IUser = {
    id: 1,
    fullName: "Usuário Admin",
    email: "admin@admin.com",
    type: "docente",
    role: "admin",
    createdAt: new Date(),
  };

  return { defaultUser, adminUser };
}

