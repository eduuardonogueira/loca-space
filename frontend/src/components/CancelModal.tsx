"use client";

import { X, AlertTriangle } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelModal({ isOpen, onClose, onConfirm }: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-200">
      
      {/* Caixa do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Cancelar Reserva</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6">
          <div className="flex flex-col gap-3">
            <p className="text-gray-600 text-sm leading-relaxed">
              Tem certeza de que deseja cancelar sua reserva? <br/>
              <span className="text-gray-500 text-xs">Esta ação não pode ser desfeita.</span>
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-bold text-white bg-[#E85D46] border border-[#E85D46] rounded-lg hover:bg-[#d14d38] transition-colors shadow-sm focus:ring-2 focus:ring-red-200"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}