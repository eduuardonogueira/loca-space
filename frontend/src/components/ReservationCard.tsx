"use client";

import Image from "next/image";
import { Trash2, MapPin, Users, Calendar } from "lucide-react";
import { getRoomPlaceholderImage } from "@/utils/roomImages";
import { IAppointment, IAppointmentWithRoomAndUser } from "@/types/appointment";

interface ReservationCardProps {
  reservation: IAppointmentWithRoomAndUser;
  onDeleteClick: (reservation: IAppointmentWithRoomAndUser) => void;
  onDetailsClick: (reservation: IAppointmentWithRoomAndUser) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);

  const date = new Date(year, month, day);

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

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
  const roomImage = reservation.room.bannerUrl
    ? reservation.room.photoUrls[0]
    : undefined;

  const locationText = getLocationText(reservation);
  const capacity = reservation.room?.totalSpace;

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-5 shadow-sm hover:shadow-md transition-shadow relative border border-gray-100">
      <div className="relative w-36 h-36 shrink-0 rounded-xl overflow-hidden">
        <Image
          src={roomImage ?? getRoomPlaceholderImage()}
          alt={reservation.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {reservation.title}
          </h3>
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
          <p className="text-xs text-gray-500 font-medium">
            {formatDate(reservation.startDateTime)}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {formatDate(reservation.endDateTime)}
          </p>
        </div>

        {/* Botão Deletar - Atualizado */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Previne conflitos de clique
            onDeleteClick(reservation);
          }}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          title="Cancelar Reserva"
        >
          <Trash2 size={20} />
        </button>

        {/* Informações Centrais */}
        <div className="space-y-3 mb-2 hidden">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#E85D46]" />
              {/* <span className="capitalize">{formatDate(reservation.date)}</span> */}
            </div>

            {/* <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#E85D46]" />
              <span>
                {reservation.startTime} - {reservation.endTime}
              </span>
            </div> */}
          </div>

          {/* Badge de Status */}
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border
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
        </div>

        {/* Rodapé: Botão Detalhes */}
        <div className="flex justify-end">
          <button
            onClick={() => onDetailsClick(reservation)}
            className="px-5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Detalhes
          </button>
          {/* <div className="flex justify-end mt-auto pt-2">
          <button className="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#E85D46] hover:border-[#E85D46] transition-colors shadow-sm">
          </button>
        </div> */}
        </div>
      </div>
    </div>
  );
}

