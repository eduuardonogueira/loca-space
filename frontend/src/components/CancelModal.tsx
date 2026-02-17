"use client";

import { X } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelModal({ isOpen, onClose, onConfirm }: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Confirmar Cancelamento</h2>
        <p className="text-gray-600 mb-6">Tem certeza que deseja cancelar esta reserva?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg">Voltar</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 text-white rounded-lg">Confirmar</button>
        </div>
      </div>
    </div>
  );
}