"use server";
import { AUTH_COOKIE_KEY } from "@/constants/cookies";
import { cookies } from "next/headers";

export async function authFetch(
  path: string | URL | globalThis.Request,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_KEY)?.value;

  const originalHeaders =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers || {};

  const mergedHeaders = {
    ...originalHeaders,
    Authorization: `Bearer ${authToken}`,
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  const mountedUrl = `${process.env.BACKEND_URL}${path}`;

  return fetch(mountedUrl, fetchOptions);
}

