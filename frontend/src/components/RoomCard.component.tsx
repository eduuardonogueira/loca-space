import React from "react";
import Link from "next/link";

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
    <Link
      href={`/rooms/${room.id}`}
      className="block"
    >
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
        <div className="relative h-[170px] overflow-hidden">
          <img
            src={room.imageUrl}
            alt={room.title}
            className="w-full h-full object-cover"
          />

          {/* Botão favorito NÃO deve navegar */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="
              absolute top-[10px] right-[10px]
              w-[26px] h-[26px] rounded-full
              bg-white/90 text-[14px]
              flex items-center justify-center
            "
            aria-label="Favoritar"
            type="button"
          >
            ♡
          </button>
        </div>

        <div className="px-[14px] pt-3 pb-3.5 flex flex-col gap-1.5">
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

          <div className="flex gap-3 mt-1 text-[12px] text-[#555]">
            <span>{room.area} m²</span>
            <span>{room.capacity} pessoas</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1.5">
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

          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              type="button"
              className="
                flex-1 h-8 rounded-full
                bg-[#f2f2f5] text-[13px] font-semibold
                text-[#555]
              "
            >
              Enviar mensagem
            </button>

            <span
              className="
                flex-1 h-8 rounded-full
                bg-[#e53935] text-[13px] font-semibold
                text-white
                flex items-center justify-center
              "
            >
              Ver detalhes
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
