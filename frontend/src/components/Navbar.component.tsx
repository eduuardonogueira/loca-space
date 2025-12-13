"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HOME_ROUTE } from "@/constants/routes";
import { IUser } from "@/types/user";
import { getProfile } from "@/api";
import { CircleUserRound, House } from "lucide-react";
import { useNavbarLinks } from "../hooks/useNavbarLinks";

export function Navbar() {
  const { navbarLinks } = useNavbarLinks();
  const [user, setUser] = useState<IUser | null>(null);

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
    <header className="flex justify-between px-9 py-8 items-center border-b-gray-300 border-1">
      <div className="flex items-center gap-2">
        <House className="text-2xl text-red-400" />
        <Link href={HOME_ROUTE} className="text-2xl font-bold text-red-400">
          LocaSpace
        </Link>
      </div>

      <nav className="flex justify-between gap-8 w-[50%]">
        {navbarLinks.map((link) => (
          <Link key={link.route} href={link.route} className="flex gap-2 items-center">
            <link.icon size={20}/>
            <p>{link.label}</p>
          </Link>
        ))}
      </nav>

      <button className="flex items-center gap-2 border-1 px-6 py-1 rounded-xl border-red-400">
        <CircleUserRound className="text-red-400" />
        <p className="text-red-400">{user?.fullName ?? "Usuário"}</p>
      </button>
    </header>
  );
}

