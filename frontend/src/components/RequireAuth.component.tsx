"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { LOGIN_ROUTE } from "@/constants/routes";

export async function RequireAuth({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) redirect(LOGIN_ROUTE);

  return children;
}