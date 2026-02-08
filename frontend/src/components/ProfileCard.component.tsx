import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";

interface ProfileCardProps {
  type?: "modal" | "page";
  onClose?: () => void; // NOVO: O Card agora aceita uma função de fechar
}

export function ProfileCard({ type = "page", onClose }: ProfileCardProps) {
  // Dados simulados
  const user = {
    name: "Teodoro da Silva Teobaldo",
    status: "Online",
    birthDate: "17/04/1999",
    location: "Cremação, Belém PA",
    email: "peduardoneivo@email.com.br",
    phone: "919999-8888",
    gender: "Homem",
    isVerified: true,
  };

  return (
    <div className="bg-white rounded-[30px] w-full max-w-[400px] p-8 relative shadow-2xl font-sans mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src="https://github.com/shadcn.png"
            alt="Foto de Perfil"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight w-40">
            {user.name}
          </h2>
          <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {user.status}
          </p>
        </div>
      </div>

      {/* Lista de Informações */}
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-gray-500" />
          <span>{user.birthDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-gray-500" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gray-500" />
          <span className="truncate w-60">{user.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-gray-500" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <User size={18} className="text-gray-500" />
          <span>{user.gender}</span>
        </div>
      </div>

      {/* Botões */}
      <div className="mt-6">
        {user.isVerified && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-4">
            <CheckCircle size={18} />
            <span>Perfil Verificado</span>
          </div>
        )}

        <div className="flex gap-3">
          {type === "modal" ? (
            /* Adicionei onClick={onClose} aqui no Link */
            <Link href="/profile" className="flex-1" onClick={onClose}>
              <button className="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                Ver Perfil
              </button>
            </Link>
          ) : (
            <button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
              Editar Perfil
            </button>
          )}

          <button className="p-3 border-2 border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
            <Share2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
