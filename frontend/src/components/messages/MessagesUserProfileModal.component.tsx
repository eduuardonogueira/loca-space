"use client";

import { MessageUserProfile } from "@/types/messages";
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  VenusAndMars,
  X,
  Eye,
} from "lucide-react";

interface MessagesUserProfileModalProps {
  isOpen: boolean;
  profile: MessageUserProfile;
  onClose: () => void;
}

export function MessagesUserProfileModal({
  isOpen,
  profile,
  onClose,
}: MessagesUserProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-155 w-full max-w-105 flex-col rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#707070] transition hover:bg-[#f3f3f3]"
        >
          <X size={18} />
        </button>

        <div className="mt-5 flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-18.5 w-18.5 rounded-full border border-[#e5e5e5] object-cover"
          />
          <div className="max-w-55">
            <h3 className="text-[40px] font-bold leading-[0.96] text-[#151515]">
              {profile.fullName}
            </h3>
            <p className="mt-2 flex items-center gap-1 text-[13px] text-[#7b7b7b]">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {profile.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-3.5 text-[14px] font-medium text-[#222]">
          <p className="flex items-center gap-2">
            <Calendar size={15} className="text-[#6f6f6f]" />
            {profile.birthDate}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-[#6f6f6f]" />
            {profile.location}
          </p>
          <p className="flex items-center gap-2">
            <Mail size={15} className="text-[#6f6f6f]" />
            {profile.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={15} className="text-[#6f6f6f]" />
            {profile.phone}
          </p>
          <p className="flex items-center gap-2">
            <VenusAndMars size={15} className="text-[#6f6f6f]" />
            {profile.gender}
          </p>
        </div>

        <button
          type="button"
          className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e74f3d] text-sm font-semibold text-white transition hover:bg-[#d53f2f]"
        >
          <Eye size={16} />
          Ver Perfil
        </button>
      </div>
    </div>
  );
}

