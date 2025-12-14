"use client";

import { logout } from "@/app/actions";
import { FaSignOutAlt } from "react-icons/fa";

export function LogoutButton() {
  return (
    <button
      className="hover:cursor-pointer"
      aria-label="Sair"
      onClick={() => logout()}
    >
      <FaSignOutAlt />
    </button>
  );
}

