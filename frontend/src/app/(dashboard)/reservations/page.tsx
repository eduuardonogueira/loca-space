"use client";

import React, { useState } from "react";

import { ReservationDetailsModal } from "../../../components/ReservationDetailsModal";
import { CalendarDays, Filter, ChevronDown } from "lucide-react";
import { ReservationCard } from "@/components/ReservationCard";
import { EmptyState } from "@/components/EmptyState";
import { Reservation } from "@/types/reservation";
import { CancelModal } from "@/components/CancelModal";

export default function ReservationsPage() {
  // 1. Estados
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED"
  >("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null,
  );

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      title: "Sala de Reunião - Prédio Executivo",
      order: 101,
      status: "CONFIRMED",
      date: "Terça Feira, Agosto 10, 2025",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      details: "",
      userId: 1,
      roomId: 10,
    },
    {
      id: 2,
      title: "Sala Industrial - Prédio",
      order: 102,
      status: "PENDING",
      date: "Segunda Feira, Agosto 9, 2025",
      startTime: "15:30 PM",
      endTime: "18:30 PM",
      details: "",
      userId: 1,
      roomId: 15,
    },
  ]);

  const handleOpenCancelFlow = (id: number) => {
    setReservationToDelete(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      setReservations((prev) =>
        prev.filter((r) => r.id !== reservationToDelete),
      );
      setIsCancelModalOpen(false);
      setReservationToDelete(null);
    }
  };

  // Lógica de Filtragem
  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "ALL") return true;
    return reservation.status === filterStatus;
  });

  // Label do Filtro
  const getFilterLabel = () => {
    switch (filterStatus) {
      case "CONFIRMED":
        return "Confirmadas";
      case "PENDING":
        return "Pendentes";
      case "CANCELLED":
        return "Canceladas";
      default:
        return "Filtros";
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <CalendarDays size={28} />
            <h1 className="text-2xl font-bold text-gray-800">
              Minhas Reservas
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              {getFilterLabel()}
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status as any);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {status === "ALL"
                      ? "Todas"
                      : status === "CONFIRMED"
                        ? "Confirmadas"
                        : status === "PENDING"
                          ? "Pendentes"
                          : "Canceladas"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {filteredReservations.map((res: Reservation) => (
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

