"use client";

import React, { useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import { ReservationCard } from "../../../components/ReservationCard";
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
    }
  ]);

  // Função disparada tanto pelo Card quanto pelo Modal de Detalhes
  const openCancelFlow = (id: number) => {
    setReservationToDelete(id);
    setIsCancelModalOpen(true);
  };

  const confirmDelete = () => {
    if (reservationToDelete) {
      setReservations(prev => prev.filter(r => r.id !== reservationToDelete));
      setIsCancelModalOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-10 flex items-center gap-3">
          <CalendarDays /> Minhas Reservas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reservations.map((res: Reservation) => (
            <ReservationCard 
              key={res.id} 
              reservation={res} 
              onDeleteClick={openCancelFlow}
              onDetailsClick={(r: Reservation) => { 
                setSelectedRes(r); 
                setIsDetailsModalOpen(true); 
              }} 
            />
          ))}
        </div>

        {/* Modal de confirmação */}
        <CancelModal 
          isOpen={isCancelModalOpen} 
          onClose={() => setIsCancelModalOpen(false)} 
          onConfirm={confirmDelete} 
        />

        {/* Modal de detalhes que dispara o fluxo de cancelamento */}
        <ReservationDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          reservation={selectedRes}
          onCancelClick={openCancelFlow}
        />
      </div>
    </main>
  );
}