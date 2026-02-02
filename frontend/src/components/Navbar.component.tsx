"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HOME_ROUTE } from "@/constants/routes";
import { IUser } from "@/types/user";
import { getProfile } from "@/api";
import { CircleUserRound, House } from "lucide-react";
import { useNavbarLinks } from "../hooks/useNavbarLinks";
import { ProfileModal } from "./ProfileModal.component";

export function Navbar() {
  const { navbarLinks } = useNavbarLinks();
  const [user, setUser] = useState<IUser | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="flex justify-between px-6 md:px-16 h-[80px] items-center bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
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

      <nav className="flex justify-between gap-8 w-[50%]">
        {navbarLinks.map((link) => (
          <Link
            key={link.route}
            href={link.route}
            className="flex gap-2 items-center text-gray-700 font-medium transition-all duration-300 hover:text-red-400 hover:scale-105 origin-center"
          >
            <link.icon size={20} />
            <p>{link.label}</p>
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setIsProfileModalOpen(true)}
        className="group flex items-center gap-2 border border-red-400 px-4 py-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
      >
        <CircleUserRound size={20} className="transition-colors" />

        <p className="font-medium">{user?.fullName ?? "Usuário"}</p>
      </button>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
}

