import { IUser } from "@/types/user";
import { Calendar, MapPin, Mail, Phone, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Loader } from "./Loader.component";
import { PROFILE_ROUTE } from "@/constants/routes";

interface ProfileCardProps {
  type?: "modal" | "page";
  onClose?: () => void;
  onEditClick?: () => void;
  user: IUser | null;
  isLoading: boolean;
}

export function ProfileCard({
  type = "page",
  onClose,
  onEditClick,
  user,
  isLoading,
}: ProfileCardProps) {
  if (isLoading)
    return (
      <div className="flex flex-col bg-white h-full w- rounded-[30px]">
        <Loader text="Carregando usuário..." />
      </div>
    );

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-white rounded-[30px] p-4 shadow-2xl">
        <p className="text-gray-500">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-[30px] w-full h-full max-w-100 p-8 relative shadow-2xl font-sans mx-auto gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatarUrl || "https://github.com/shadcn.png"}
            alt="Foto de Perfil"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight w-40">
            {user.fullName}
          </h2>
          <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        {user.birthDate && (
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-500" />
            <span>{new Date(user.birthDate).toLocaleDateString("pt-BR")}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-gray-500" />
          <span>
            {user.address.city} - {user.address.state}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gray-500" />
          <span className="truncate w-60">{user.email}</span>
        </div>

        {user.phone && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-gray-500" />
            <span>{user.phone}</span>
          </div>
        )}

        {user.gender && (
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-500" />
            <span>{user.gender}</span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex gap-3">
          {type === "modal" ? (
            <Link href={PROFILE_ROUTE} className="flex-1" onClick={onClose}>
              <button className="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                Ver Perfil
              </button>
            </Link>
          ) : (
            <button
              onClick={onEditClick}
              className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

