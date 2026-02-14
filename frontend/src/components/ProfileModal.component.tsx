import { X } from "lucide-react";
import { ProfileCard } from "./ProfileCard.component"; // Importamos nossa peça de Lego!

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="relative">
        {/* Botão de Fechar (X) - continua exclusivo do Modal */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-500 hover:text-red-500 p-2 rounded-full shadow-lg transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* MESMO card da página */}
        <ProfileCard type="modal" onClose={onClose} />
      </div>
    </div>
  );
}
