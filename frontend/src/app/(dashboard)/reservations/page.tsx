"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { ReservationDetailsModal } from "../../../components/ReservationDetailsModal";
import { CalendarDays, Filter, ChevronDown } from "lucide-react";
import { ReservationCard } from "@/components/ReservationCard";
import { EmptyState } from "@/components/EmptyState";
import { Reservation } from "@/types/reservation";
import { CancelModal } from "@/components/CancelModal";
import { deleteReservation, fetchReservations } from "@/services/reservation";
import { toast } from "react-toastify";

type ReservationOrderBy =
  | "capacityDesc"
  | "capacityAsc"
  | "dateDesc"
  | "dateAsc";

export default function ReservationsPage() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [orderBy, setOrderBy] = useState<ReservationOrderBy>("dateDesc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null,
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const orderOptions: Array<{ value: ReservationOrderBy; label: string }> = [
    {
      value: "capacityDesc",
      label: "Quantidade de pessoas: do maior para o menor",
    },
    {
      value: "capacityAsc",
      label: "Quantidade de pessoas: do menor para o maior",
    },
    {
      value: "dateDesc",
      label: "Data de reserva: mais recente",
    },
    {
      value: "dateAsc",
      label: "Data de reserva: mais antigo",
    },
  ];

  async function loadReservations() {
    setIsLoading(true);
    const data = await fetchReservations();

    if (!data) {
      toast.error("Erro ao carregar reservas");
      setReservations([]);
      setIsLoading(false);
      return;
    }

    setReservations(data);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadReservations();
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleOpenCancelFlow = (id: number) => {
    setReservationToDelete(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reservationToDelete === null || isCanceling) return;

    setIsCanceling(true);
    const deleted = await deleteReservation(reservationToDelete);
    if (!deleted) {
      toast.error("Não foi possível cancelar a reserva.");
      setIsCanceling(false);
      return;
    }

    setIsCancelModalOpen(false);
    setReservationToDelete(null);
    if (selectedRes?.id === reservationToDelete) {
      setSelectedRes(null);
      setIsDetailsModalOpen(false);
    }
    toast.success("Reserva cancelada com sucesso");
    await loadReservations();
    setIsCanceling(false);
  };

  const sortedReservations = useMemo(() => {
    const list = [...reservations];

    if (orderBy === "capacityDesc") {
      return list.sort(
        (a, b) => (b.room?.totalSpace ?? 0) - (a.room?.totalSpace ?? 0),
      );
    }

    if (orderBy === "capacityAsc") {
      return list.sort(
        (a, b) => (a.room?.totalSpace ?? 0) - (b.room?.totalSpace ?? 0),
      );
    }

    if (orderBy === "dateAsc") {
      return list.sort((a, b) => {
        const aTime = new Date(`${a.date}T${a.startTime || "00:00"}`).getTime();
        const bTime = new Date(`${b.date}T${b.startTime || "00:00"}`).getTime();
        return aTime - bTime;
      });
    }

    return list.sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime || "00:00"}`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime || "00:00"}`).getTime();
      return bTime - aTime;
    });
  }, [reservations, orderBy]);

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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Filtros
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-md z-10 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Ordenar por
                </p>
                {orderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setOrderBy(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full border ${
                        orderBy === option.value
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 bg-white"
                      }`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            Carregando reservas...
          </div>
        ) : sortedReservations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {sortedReservations.map((res: Reservation) => (
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
          isLoading={isCanceling}
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
