"use client";

import Image from "next/image";
import { Trash2, MapPin, Users, Calendar } from "lucide-react";
import { IAppointmentWithRoomAndUser } from "@/types/appointment";
import { formatReservationDate } from "@/utils/formatDate";

interface ReservationCardProps {
  reservation: IAppointmentWithRoomAndUser;
  onDeleteClick: (reservation: IAppointmentWithRoomAndUser) => void;
  onDetailsClick: (reservation: IAppointmentWithRoomAndUser) => void;
}

function getLocationText(reservation: IAppointmentWithRoomAndUser): string {
  const city = reservation.room?.address?.city ?? "";
  const bairro = reservation.room?.address?.bairro ?? "";

  if (city && bairro) return `${city}, ${bairro}`;
  if (city) return city;
  if (bairro) return bairro;
  return "Localização não informada";
}

export function ReservationCard({
  reservation,
  onDeleteClick,
  onDetailsClick,
}: ReservationCardProps) {
  const locationText = getLocationText(reservation);
  const capacity = reservation.room?.totalSpace;

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-5 shadow-sm hover:shadow-md transition-shadow relative border border-gray-100">
      <div className="relative w-36 h-36 shrink-0 rounded-xl overflow-hidden">
        <Image
          src={reservation.room.bannerUrl ?? ""}
          alt={reservation.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {reservation.title} - {reservation.room.name}
          </h3>

          {/* Location e People */}
          <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1 mb-4">
            <div className="flex items-center gap-1">
              <MapPin size={14} /> <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />{" "}
              <span>
                {typeof capacity === "number" ? `${capacity} Pessoas` : "-"}
              </span>
            </div>
          </div>

          {/* Horario */}
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex gap-1">
              <span className="flex gap-2 ">
                <Calendar size={18} />
                Início:
              </span>
              <p>{formatReservationDate(reservation.startDateTime)}</p>
            </div>
            <div className="flex gap-1">
              <span className="flex gap-2">
                <Calendar size={18} className="" />
                Fim:
              </span>
              <p>{formatReservationDate(reservation.endDateTime)}</p>
            </div>
          </div>

          {/* Status */}
          <span
            className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border
              ${
                reservation.status === "CONFIRMED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : reservation.status === "PENDING"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {reservation.status === "CONFIRMED"
              ? "Confirmada"
              : reservation.status === "PENDING"
                ? "Pendente"
                : "Cancelada"}
          </span>
        </div>

        {/* Botão Deletar - Atualizado */}
        <button
          type="button"
          onClick={() => onDeleteClick(reservation)}
          className="absolute top-4 right-4 cursor-pointer text-red-500 hover:text-red-600 p-2 rounded-lg bg-transparent hover:bg-red-100 transition-colors border border-red-100 hover:border-red-600"
          title="Cancelar Reserva"
        >
          <Trash2 size={20} />
        </button>

        {/* Rodapé: Botão Detalhes */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onDetailsClick(reservation)}
            className="px-5 py-1.5 text-xs cursor-pointer font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

