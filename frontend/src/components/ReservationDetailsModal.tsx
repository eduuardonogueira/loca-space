"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ruler,
  Warehouse,
  Car,
  Wifi,
  Presentation,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Reservation } from "../types/reservation";
import { formatRoomAddress } from "@/utils/formatRoomAddress";
import { getRoomImageList, getRoomPlaceholderImage } from "@/utils/roomImages";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onCancelClick: (id: number) => void;
}

function formatReservationDate(date: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ReservationDetailsModal({
  isOpen,
  onClose,
  reservation,
  onCancelClick,
}: ModalProps) {
  const [currentImg, setCurrentImg] = useState(0);

  if (!isOpen || !reservation) return null;

  const images = reservation.room?.imageUrl
    ? getRoomImageList(reservation.room.imageUrl)
    : [];
  const gallery = images.length > 0 ? images : [getRoomPlaceholderImage()];
  const safeCurrentImageIndex = currentImg % gallery.length;
  const nextImageIndex = (safeCurrentImageIndex + 1) % gallery.length;
  const amenities = reservation.room?.amenities ?? [];

  useEffect(() => {
    setCurrentImg(0);
  }, [reservation.id, isOpen]);

  const handleCancelBtnClick = () => {
    onClose();
    setTimeout(() => {
      onCancelClick(reservation.id);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans leading-none">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Galeria de Fotos Lateral */}
        <div className="relative h-60 w-full flex gap-1 p-1 bg-gray-50">
          <div className="relative flex-[2] rounded-l-2xl overflow-hidden">
            <Image
              src={gallery[safeCurrentImageIndex]}
              alt="Principal"
              fill
              className="object-cover"
            />
          </div>
          <div
            className="relative flex-1 rounded-r-2xl overflow-hidden cursor-pointer group"
            onClick={() => setCurrentImg(nextImageIndex)}
          >
            <Image
              src={gallery[nextImageIndex]}
              alt="Próxima"
              fill
              className="object-cover opacity-60 transition-opacity group-hover:opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRight size={36} className="text-white drop-shadow-md" />
            </div>
          </div>
        </div>

        <div className="p-10 text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
            {reservation.title}
          </h2>
          <div className="flex items-center gap-1 text-[12px] text-gray-400 mb-6">
            <MapPin size={14} />
            <span>
              {formatRoomAddress(reservation.room?.address) ||
                "Localização não informada"}
            </span>
          </div>

          <div className="flex gap-10 mb-8 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-900" />{" "}
              {formatReservationDate(reservation.date)}
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-bold">
              <Clock size={18} /> {reservation.startTime} -{" "}
              {reservation.endTime}
            </div>
          </div>

          {/* Grid de Ícones e Comodidades */}
          <div className="grid grid-cols-2 gap-y-4 border-t border-gray-100 pt-6 mb-8 text-[12px] font-bold text-gray-600">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-gray-300" />{" "}
              {typeof reservation.room?.totalSpace === "number"
                ? `${reservation.room.totalSpace} Pessoas`
                : "-"}
            </div>
            <div className="flex items-center gap-3">
              <Ruler size={18} className="text-gray-300" />{" "}
              {typeof reservation.room?.size === "number"
                ? `${reservation.room.size} m²`
                : "-"}
            </div>
            <div className="flex items-center gap-3">
              <Warehouse size={18} className="text-gray-300" />{" "}
              {amenities[0]?.name ?? "-"}
            </div>
            <div className="flex items-center gap-3">
              <Car size={18} className="text-gray-300" />{" "}
              {typeof reservation.room?.parkingSlots === "number"
                ? `${reservation.room.parkingSlots} Vagas`
                : "-"}
            </div>
            <div className="flex items-center gap-3">
              <Wifi size={18} className="text-gray-300" />{" "}
              {amenities[1]?.name ?? "-"}
            </div>
            <div className="flex items-center gap-3">
              <Presentation size={18} className="text-gray-300" />{" "}
              {amenities[2]?.name ?? "-"}
            </div>
          </div>

          {/* Preço Alinhado à Esquerda */}
          <div className="mb-8">
            <p className="text-3xl font-[900] text-gray-900 tracking-tight">
              {typeof reservation.room?.price === "number"
                ? reservation.room.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 2,
                  })
                : "-"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCancelBtnClick}
              className="w-full py-4 bg-[#E85D46] hover:bg-[#d14d3a] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Trash2 size={20} /> Cancelar
            </button>

            <Link
              href={`/rooms/${reservation.roomId}`}
              className="w-full py-4 bg-[#BDBDBD] hover:bg-[#a9a9a9] text-white font-bold rounded-2xl transition-all text-center flex items-center justify-center"
            >
              Página do Anúncio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
