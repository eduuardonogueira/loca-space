"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MapPin,
  Calendar,
  Trash2,
  ChevronRight,
  Users,
  Ruler,
  Building2,
  CircleDollarSign,
} from "lucide-react";
import { formatRoomAddress } from "@/utils/formatRoomAddress";
import { getRoomPlaceholderImage } from "@/utils/roomImages";
import { IAppointmentWithRoomAndUser } from "@/types/appointment";
import { formatReservationDate } from "@/utils/formatDate";
import { ROOM_ROUTE } from "@/constants/routes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: IAppointmentWithRoomAndUser | null;
  onCancelClick: (id: number) => void;
}

export function ReservationDetailsModal({
  isOpen,
  onClose,
  reservation,
  onCancelClick,
}: ModalProps) {
  const [currentImg, setCurrentImg] = useState(0);

  if (!isOpen || !reservation) return null;

  // ✅ Ajuste: bannerUrl e photoUrls podem ser undefined
  const images =
    reservation.room.photoUrls && reservation.room.photoUrls.length > 0
      ? reservation.room.photoUrls
      : reservation.room.bannerUrl
        ? [reservation.room.bannerUrl]
        : [];

  const gallery = images.length > 0 ? images : [getRoomPlaceholderImage()];
  const safeCurrentImageIndex = currentImg % gallery.length;
  const nextImageIndex = (safeCurrentImageIndex + 1) % gallery.length;

  const handleCancelBtnClick = () => {
    onClose();
    setTimeout(() => {
      onCancelClick(reservation.id);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans leading-none">
      <div className="bg-white rounded-4xl w-full max-w-xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200 ">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Galeria de Fotos Lateral */}
        <div className="relative h-60 w-full flex gap-1 bg-gray-50">
          <div className="relative flex-2 overflow-hidden">
            <Image
              src={gallery[safeCurrentImageIndex]}
              alt="Principal"
              fill
              className="object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div
              className="relative flex-1 overflow-hidden cursor-pointer group"
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
          )}
        </div>

        <div className="p-10 text-left grid grid-cols-2">
          {/* Sala e Localização */}
          <div className="col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              {reservation.room.name}
            </h2>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-6">
              <MapPin size={14} />
              <span>
                {formatRoomAddress(reservation.room?.address) ||
                  "Localização não informada"}
              </span>
            </div>
          </div>

          {/* Horários */}
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex flex-col gap-1">
              <span className="flex gap-2 ">
                <Calendar size={18} />
                Início:
              </span>
              <p>{formatReservationDate(reservation.startDateTime)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex gap-2">
                <Calendar size={18} className="" />
                Fim:
              </span>
              <p>{formatReservationDate(reservation.endDateTime)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm">Detalhes da sala:</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              <p className="flex gap-2">
                <Users size={20} />
                {reservation.room.totalSpace} Pessoas
              </p>
              <p className="flex gap-2">
                <Ruler size={20} />
                {reservation.room.size} (m²)
              </p>
              <p className="flex gap-2">
                <Building2 size={20} />
                {reservation.room.type}
              </p>
              <p className="flex gap-2">
                <CircleDollarSign size={20} />
                {reservation.price != null
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(reservation.price)
                  : "-"}
              </p>
            </div>
          </div>

          {/* Preço Alinhado à Esquerda */}
          <div className="col-span-2 flex w-full justify-between items-center my-6 font-bold text-2xl">
            <p>Total:</p>
            <p>
              {reservation.totalValue != null
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(reservation.totalValue)
                : "-"}
            </p>
          </div>

          <div className="flex flex-col gap-3 col-span-2">
            <button
              onClick={handleCancelBtnClick}
              className="w-full py-4 bg-[#E85D46] hover:bg-[#d14d3a] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Trash2 size={20} /> Cancelar
            </button>

            <Link
              href={ROOM_ROUTE.replace("[id]", reservation.room.id.toString())}
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
