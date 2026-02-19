"use server";

import { ICreateUser, IProfile, IUser } from "@/types/user";
import { cookies } from "next/headers";
import { authFetch } from "./authFetch.ts";
import { AUTH_COOKIE_KEY } from "@/constants/cookies.ts";

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    if (!response || response.status === 401) return false;

    const data = await response.json();
    const { access_token } = data;

    if (access_token) {
      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE_KEY, access_token);
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
}

export async function signup(userData: ICreateUser): Promise<IUser | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, role: "user" }),
    });

    return response.json();
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function validate(): Promise<boolean> {
  try {
    const response = await authFetch("/auth/validate", {
      method: "GET",
    });

    if (!response || response.status === 401) return false;

    return response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getProfile(): Promise<IUser | null> {
  try {
    const response = await authFetch("/auth/profile", {
      method: "GET",
    });

    if (!response || response.status === 401) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserProfile(): Promise<IUser | null> {
  try {
    const response = await authFetch("/user/me", {
      method: "GET",
    });

    if (!response || response.status === 401) return null;

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

