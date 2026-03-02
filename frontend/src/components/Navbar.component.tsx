"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME_ROUTE } from "@/constants/routes";
import { CircleUserRound, House } from "lucide-react";
import { useNavbarLinks } from "../hooks/useNavbarLinks";
import { ProfileModal } from "./ProfileModal.component";
import { useProfile } from "@/hooks/useProfile";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const { navbarLinks } = useNavbarLinks();
  const { profile, isLoading } = useProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  function formatUserName(name: string) {
    const defaultName = "Usuário Padrão";
    const splitted = name ? name.split(" ") : defaultName.split(" ");
    const firstName = splitted[0];
    const lastName = splitted[splitted.length - 1];
    return `${firstName} ${lastName}`;
  }

  return (
    <header className="flex justify-between px-6 md:px-16 h-20 items-center bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="transition-transform duration-300 group-hover:scale-110 text-red-400">
          <House className="text-2xl" />
        </div>
        <Link
          href={HOME_ROUTE}
          className="text-2xl font-bold text-red-400 transition-opacity duration-300 group-hover:opacity-80"
        >
          LocaSpace
        </Link>
      </div>

      <nav className="flex justify-center gap-8 w-[70%]">
        {navbarLinks.map((link) => {
          const isActive = pathname === link.route;

          return (
            <Link
              key={link.route}
              href={link.route}
              className={`
                flex gap-2 items-center text-gray-700 font-medium
                transition-all duration-300 hover:text-red-400
                hover:scale-105 origin-center ${
                  isActive ? "text-red-500" : "text-gray-700 hover:text-red-400"
                }
              `}
            >
              <link.icon size={20} />
              <p>{link.label}</p>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setIsProfileModalOpen(true)}
        className="group flex items-center gap-2 border border-red-400 px-4 py-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
      >
        <CircleUserRound size={20} className="transition-colors" />

        <p className="font-medium">
          {profile ? formatUserName(profile.fullName) : "Carregando..."}
        </p>
      </button>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        isLoading={isLoading}
      />
    </header>
  );
}

