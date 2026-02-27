import { Calendar, MapPin, Mail, Phone, User, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Loader } from "./Loader.component";
import { PROFILE_ROUTE } from "@/constants/routes";
import { logout } from "@/app/actions";
import { IUser } from "@/types/user";

interface ProfileCardProps {
  type?: "modal" | "page";
  onClose?: () => void;
  onEditClick?: () => void;
  profile: IUser | null;
  isLoading: boolean;
}

export function ProfileCard({
  type = "page",
  onClose,
  onEditClick,
  profile,
  isLoading,
}: ProfileCardProps) {
  if (isLoading)
    return (
      <div className="flex flex-col bg-white h-full w- rounded-[30px]">
        <Loader text="Carregando usuário..." />
      </div>
    );

  if (!profile) {
    return (
      <div className="flex items-center justify-center bg-white rounded-[30px] p-4 shadow-2xl">
        <p className="text-gray-500">Usuário não encontrado</p>
        <button
          className="w-full border-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
          onClick={() => logout()}
        >
          <LogOutIcon />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-[30px] w-full h-full max-h-[90vh] max-w-100 p-8 relative shadow-2xl font-sans mx-auto gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              profile.avatarUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/960px-Windows_10_Default_Profile_Picture.svg.png"
            }
            alt="Foto de Perfil"
            className="w-16 h-16 rounded-full  border-2 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 w-full">
            {profile.fullName}
          </h2>
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {profile.role}
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        {profile.birthDate && (
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-500" />
            <span>
              {new Date(profile.birthDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-gray-500" />
          <span>
            <span>
              {profile?.address?.street && `${profile?.address?.street}, `}
              {profile?.address?.bairro && `${profile?.address?.bairro} - `}
              {profile?.address?.city || "Cidade não informada"} /{" "}
              {profile?.address?.state || "UF"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gray-500" />
          <span className="truncate w-60">{profile.email}</span>
        </div>

        {profile.phone && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-gray-500" />
            <span>{profile.phone}</span>
          </div>
        )}

        {profile.gender && (
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-500" />
            <span>{profile.gender}</span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex gap-3">
          {type === "modal" ? (
            <div className="flex flex-col gap-2 w-full">
              <Link href={PROFILE_ROUTE} className="flex-1" onClick={onClose}>
                <button className="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                  Ver Perfil
                </button>
              </Link>
              <button
                className="flex justify-center gap-2 w-full border border-red-500 text-red-500 font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-colors"
                onClick={() => logout()}
              >
                <LogOutIcon />
                Sair da conta
              </button>
            </div>
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
