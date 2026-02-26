"use client";

import { X } from "lucide-react";
import { ProfileCard } from "./ProfileCard.component";
import { IUser } from "@/types/user";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IUser | null;
  isLoading: boolean;
}

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  isLoading,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm min-w-100">
      <div className="relative flex">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-500 hover:text-red-500 p-2 rounded-full shadow-lg transition-colors z-10"
        >
          <X size={20} />
        </button>

        <ProfileCard
          type="modal"
          onClose={onClose}
          isLoading={isLoading}
          profile={profile}
        />
      </div>
    </div>
  );
}

