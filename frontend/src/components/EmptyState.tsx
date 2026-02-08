"use client";

import Link from "next/link";
import { CalendarX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center min-h-[400px]">
      
      {/* Ícone de Calendário */}
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <CalendarX size={48} className="text-gray-400" />
      </div>
      
      {/* Título */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Sem Reservas Atualmente
      </h3>
      
      {/* Subtítulo */}
      <p className="text-gray-500 mb-8 max-w-md">
        Você não tem agendamentos no momento. 
        Que tal procurar uma sala ideal para sua próxima reunião?
      </p>

      {/* Botão "Agendar Agora" - Cor #E85D46 */}
      <Link 
        href="/home" 
        className="px-6 py-3 bg-[#E85D46] hover:bg-[#d14d38] text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Agendar Agora
      </Link>
    </div>
  );
}