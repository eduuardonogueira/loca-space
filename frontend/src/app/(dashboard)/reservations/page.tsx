"use client";

import React, { useState } from "react";
import { CalendarDays, Filter } from "lucide-react";

import { ReservationCard } from "../../../components/ReservationCard";
import { EmptyState } from "../../../components/EmptyState";
import { ReservationDetailsModal } from "../../../components/ReservationDetailsModal";
import { CancelModal } from "../../../components/CancelModal";
import { Reservation } from "../../../types/reservation";

export default function ReservationsPage() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([
    { 
      id: 1, title: "Sala de Reunião - Prédio Executivo", order: 101, status: "CONFIRMED", 
      date: "Terça Feira, Agosto 10, 2025", startTime: "11:00 AM", endTime: "12:00 PM", 
      details: "", userId: 1, roomId: 10 
    },
    { 
      id: 2, title: "Sala Industrial - Prédio", order: 102, status: "PENDING", 
      date: "Segunda Feira, Agosto 9, 2025", startTime: "15:30 PM", endTime: "18:30 PM", 
      details: "", userId: 1, roomId: 15 
    }
  ]);

  const handleOpenCancelFlow = (id: number) => {
    setReservationToDelete(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      setReservations(prev => prev.filter(r => r.id !== reservationToDelete));
      setIsCancelModalOpen(false);
      setReservationToDelete(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <CalendarDays size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Minhas Reservas</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter size={18} /> Filtros
          </button>
        </div>

        {reservations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {reservations.map((res: Reservation) => (
              <ReservationCard 
                key={res.id} 
                reservation={res} 
                onDeleteClick={handleOpenCancelFlow}
                onDetailsClick={(r: Reservation) => { 
                  setSelectedRes(r); 
                  setIsDetailsModalOpen(true); 
                }} 
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <CancelModal 
          isOpen={isCancelModalOpen} 
          onClose={() => setIsCancelModalOpen(false)} 
          onConfirm={handleConfirmDelete} 
        />

        <ReservationDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          reservation={selectedRes}
          onCancelClick={handleOpenCancelFlow}
        />
      </div>
    </main>
  );
}