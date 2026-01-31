"use client";

import { createContext } from "react";

export type ProfileModalValues = {};

type ProfileModalContextData = ProfileModalValues & {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const ProfileModalContext = createContext<ProfileModalContextData>(
  {} as ProfileModalContextData,
);

