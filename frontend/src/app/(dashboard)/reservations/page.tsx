"use client";

import React, { useMemo, useRef, useState } from "react";

import { ReservationDetailsModal } from "../../../components/ReservationDetailsModal";
import { CalendarDays, Filter, ChevronDown } from "lucide-react";
import { ReservationCard } from "@/components/ReservationCard";
import { EmptyState } from "@/components/EmptyState";
import { CancelModal } from "@/components/CancelModal";
import { toast } from "react-toastify";
import { useReservations } from "@/hooks/useReservations";
import { deleteAppointment } from "@/services/appointments";
import { IAppointmentWithRoomAndUser } from "@/types/appointment";

type ReservationOrderBy =
  | "capacityDesc"
  | "capacityAsc"
  | "dateDesc"
  | "dateAsc";

export default function ReservationsPage() {
  const { reservations, fetchReservations, isLoading } = useReservations();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] =
    useState<IAppointmentWithRoomAndUser | null>(null);
  const [orderBy, setOrderBy] = useState<ReservationOrderBy>("dateDesc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleOpenCancelFlow = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmDelete = async (
    reservation: IAppointmentWithRoomAndUser,
  ) => {
    setIsCanceling(true);

    const deleted = await deleteAppointment(reservation.id);

    if (!deleted) {
      toast.error("Não foi possível cancelar a reserva.");
      setIsCanceling(false);
      return;
    }

    toast.success("Reserva cancelada com sucesso");

    setIsCanceling(false);
    setIsCancelModalOpen(false);
    await fetchReservations();
  };

  const sortedReservations = useMemo(() => {
    if (reservations === null) return [];

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
      return list.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime(),
      );
    }

    return list.sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime(),
    );
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
            {sortedReservations.map((res: IAppointmentWithRoomAndUser) => (
              <ReservationCard
                key={res.id}
                reservation={res}
                onDeleteClick={handleOpenCancelFlow}
                onDetailsClick={() => {
                  setSelectedRes(res);
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
          reservation={selectedRes}
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

