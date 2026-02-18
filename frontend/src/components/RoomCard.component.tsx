"use client";

import React from "react";
import Link from "next/link";
import { Heart, Ruler, Users, MessageCircle, ArrowRight } from "lucide-react";

export type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  area: number;
  capacity: number;
  amenities: string[];

  description: string;
  address: string;
  type: string;
  rules: string;
  schedule: string;
};

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`} className="block">
      <article
        className="
          bg-white rounded-[14px] overflow-hidden
          border border-[#e0e0e4]
          shadow-[0_10px_25px_rgba(15,23,42,0.06)]
          flex flex-col
          transition hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)]
          hover:-translate-y-1
          duration-200
          cursor-pointer
        "
      >
        {/* IMAGEM */}
        <div className="relative h-[170px] overflow-hidden">
          <img
            src={room.imageUrl}
            alt={room.title}
            className="w-full h-full object-cover"
          />

          {/* FAVORITO (não navega) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="
              absolute top-3 right-3
              w-8 h-8 rounded-full
              bg-white/95 text-[#333]
              flex items-center justify-center
              shadow-sm
              transition hover:scale-105 active:scale-95
            "
            aria-label="Favoritar"
            type="button"
          >
            <Heart size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-1.5">
          <h2 className="text-[14px] font-semibold text-[#222]">
            {room.title}
          </h2>

          <p className="text-[12px] text-[#777]">{room.location}</p>

          <p className="text-[16px] font-bold text-[#e53935] mt-1">
            R{"$ "}
            {room.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>

          {/* ÁREA E CAPACIDADE COM ÍCONES */}
          <div className="flex gap-4 mt-1 text-[12px] text-[#555] items-center">
            <div className="flex items-center gap-1">
              <Ruler size={14} strokeWidth={1.8} className="text-[#e53935]" />
              <span>{room.area} m²</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={14} strokeWidth={1.8} className="text-[#e53935]" />
              <span>{room.capacity} pessoas</span>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="
                  text-[11px] px-2 py-[3px] rounded-full
                  bg-[#f2f4fb] text-[#555]
                "
              >
                {a}
              </span>
            ))}
          </div>

          {/* BOTÕES EMPILHADOS */}
          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              type="button"
              className="
                w-full h-9 rounded-full
                bg-[#f2f2f5] text-[13px] font-semibold
                text-[#555]
                flex items-center justify-center gap-2
                transition hover:bg-[#e7e7eb]
              "
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              Enviar mensagem
            </button>

            {/* "Ver detalhes" é só visual (Link já cobre o card) */}
            <span
              className="
                w-full h-9 rounded-full
                bg-[#e53935] text-[13px] font-semibold
                text-white
                flex items-center justify-center gap-2
                transition hover:bg-[#d32f2f]
              "
            >
              Ver detalhes
              <ArrowRight size={16} strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
