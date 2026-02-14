"use client";

import Image from "next/image";
import { Trash2, MapPin, Calendar, Clock } from "lucide-react";
import { Reservation } from "@/types/reservation"; 

interface ReservationCardProps {
  reservation: Reservation;
  onDelete: (id: number) => void;
}

// CORREÇÃO AQUI: Função segura contra fuso horário
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  
  // Divide a string "YYYY-MM-DD" manualmente para evitar conversão de timezone
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Mês no JS começa em 0
  const day = parseInt(parts[2]);
  
  // Cria a data no horário local do usuário, garantindo que o dia permaneça o mesmo
  const date = new Date(year, month, day);
  
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

export function ReservationCard({ reservation, onDelete }: ReservationCardProps) {
  return (
    <div className="group relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-h-[180px]">
      
      {/* 1. IMAGEM (Lado Esquerdo) */}
      <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 bg-gray-100">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt={reservation.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 2. CONTEÚDO (Lado Direito) */}
      <div className="p-5 flex flex-col justify-between flex-1 relative">
        
        {/* Cabeçalho: Título e Localização */}
        <div className="pr-12">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
            {reservation.title}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin size={14} className="text-gray-400" />
            <span>Sala {reservation.roomId} • Unidade Central</span>
          </div>
        </div>

        {/* Botão Deletar */}
        <button 
          onClick={() => onDelete(reservation.id)}
          className="absolute top-4 right-4 text-red-300 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          title="Cancelar Reserva"
        >
          <Trash2 size={20} />
        </button>

        {/* Informações Centrais */}
        <div className="space-y-3 mb-2">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
               <Calendar size={16} className="text-[#E85D46]" />
               <span className="capitalize">{formatDate(reservation.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
               <Clock size={16} className="text-[#E85D46]" />
               <span>{reservation.startTime} - {reservation.endTime}</span>
            </div>
          </div>
          
          {/* Badge de Status */}
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border
              ${reservation.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' : 
                reservation.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                'bg-red-50 text-red-700 border-red-200'}`}>
              {reservation.status === 'CONFIRMED' ? 'Confirmada' : 
               reservation.status === 'PENDING' ? 'Pendente' : 'Cancelada'}
            </span>
          </div>
        </div>

        {/* Rodapé: Botão Detalhes */}
        <div className="flex justify-end mt-auto pt-2">
          <button className="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#E85D46] hover:border-[#E85D46] transition-colors shadow-sm">
            Detalhes
          </button>
        </div>

      </div>
    </div>
  );
}