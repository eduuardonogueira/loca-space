"use client"

import { ReactNode, useContext, useState } from "react";
import { ProfileModalContext } from "./profileModal.context";

export function ProfileModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProfileModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </ProfileModalContext.Provider>
  );
}

export const useProfileModal = () => {
  const context = useContext(ProfileModalContext);

  if (!context) {
    throw new Error(
      "useProfileModalContext must be used within an ModalProvider",
    );
  }

  return context;
};

