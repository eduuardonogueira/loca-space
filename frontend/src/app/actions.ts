"use server";

import { AUTH_COOKIE_KEY } from "@/constants/cookies";
import { LOGIN_ROUTE } from "@/constants/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login as apiLogin } from "@/api/index";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_KEY);
  redirect(LOGIN_ROUTE);
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  return apiLogin(username, password);
}

