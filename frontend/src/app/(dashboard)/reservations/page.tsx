"use client";

import React, { useState } from "react";
import { CalendarDays, Filter, ChevronDown } from "lucide-react";
import { ReservationCard } from "@/components/ReservationCard";
import { EmptyState } from "@/components/EmptyState";
import { Reservation } from "@/types/reservation";

export default function ReservationsPage() {
  // 1. Estados
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CANCELLED">("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar abertura do menu

  // 2. Dados Fictícios (MOCK)
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      order: 101,
      status: "CONFIRMED",
      date: "2025-08-10",
      startTime: "14:00",
      endTime: "16:00",
      details: "Reunião de alinhamento",
      title: "Sala de Reunião - Prédio Executivo",
      userId: 1,
      roomId: 10,
    },
    {
      id: 2,
      order: 102,
      status: "PENDING",
      date: "2025-08-11",
      startTime: "09:00",
      endTime: "11:00",
      details: "Workshop de Design",
      title: "Sala Industrial - Prédio",
      userId: 1,
      roomId: 15,
    },
    {
      id: 3,
      order: 103,
      status: "CANCELLED",
      date: "2025-08-12",
      startTime: "13:00",
      endTime: "14:00",
      details: "Entrevista Candidato",
      title: "Sala Pequena - Coworking",
      userId: 1,
      roomId: 5,
    },
    {
      id: 4,
      order: 104,
      status: "CONFIRMED",
      date: "2025-08-15",
      startTime: "10:00",
      endTime: "12:00",
      details: "Apresentação",
      title: "Auditório Principal",
      userId: 1,
      roomId: 20,
    }
  ]);

  const handleDelete = (id: number) => {
    setReservations((prev) => prev.filter((item) => item.id !== id));
  };

  // Lógica de Filtragem
  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "ALL") return true;
    return reservation.status === filterStatus;
  });

  // Label do Filtro
  const getFilterLabel = () => {
    switch (filterStatus) {
      case "CONFIRMED": return "Confirmadas";
      case "PENDING": return "Pendentes";
      case "CANCELLED": return "Canceladas";
      default: return "Filtros";
    }
  };

  // Função para selecionar uma opção e fechar o menu
  const handleSelectFilter = (status: typeof filterStatus) => {
    setFilterStatus(status);
    setIsDropdownOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#E85D46]" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Minhas Reservas</h1>
          </div>

          {/* Dropdown Manual (Sem erros de biblioteca e visual idêntico ao print) */}
          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full md:w-48 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-[#E85D46] text-gray-700 shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500 group-hover:text-[#E85D46]" />
                <span className="font-medium text-sm">{getFilterLabel()}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Dropdown */}
            {isDropdownOpen && (
              <>
                {/* Overlay transparente para fechar ao clicar fora */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                
                {/* Lista de Opções */}
                <div className="absolute right-0 mt-2 w-full md:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button onClick={() => handleSelectFilter("ALL")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E85D46]">
                    Todas as reservas
                  </button>
                  <button onClick={() => handleSelectFilter("CONFIRMED")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E85D46]">
                    Confirmadas
                  </button>
                  <button onClick={() => handleSelectFilter("PENDING")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E85D46]">
                    Pendentes
                  </button>
                  <button onClick={() => handleSelectFilter("CANCELLED")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E85D46]">
                    Canceladas
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lista ou Empty State */}
        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

      </div>
    </main>
  );
}