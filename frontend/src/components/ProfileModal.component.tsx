import React from "react";
import {
  X,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle,
  Share2,
} from "lucide-react";
import { Modal } from "flowbite-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[30px] w-[400px] p-8 relative shadow-2xl font-sans">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                alt="Foto de Perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Teodoro da
                <br />
                Silva Teobaldo
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-green-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-gray-900" />
              <span className="text-sm font-medium">17/04/1999</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={20} className="text-gray-900" />
              <span className="text-sm font-medium">Cremação, Belém PA</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-gray-900" />
              <span className="text-sm font-medium">
                peduardoneivo@email.com.br
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={20} className="text-gray-900" />
              <span className="text-sm font-medium">919999-8888</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <User size={20} className="text-gray-900" />
              <span className="text-sm font-medium">Homem</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-sm text-green-600 font-medium italic">
                Perfil Verificado
              </span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200">
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

