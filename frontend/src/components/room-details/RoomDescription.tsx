"use client";

import {
  MapPin,
  Building2,
  Clock,
  FileText,
} from "lucide-react";

type RoomDescriptionProps = {
  description: string;
  address: string;
  type: string;
  rules: string;
  schedule: string;
  amenities: string[];
};

export function RoomDescription({
  description,
  address,
  type,
  rules,
  schedule,
  amenities,
}: RoomDescriptionProps) {
  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-[#222]">
        Descrição do imóvel
      </h2>

      <p className="mt-4 text-sm leading-relaxed text-[#555]">
        {description}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <MapPin size={16} strokeWidth={1.8} />
            <span>Endereço</span>
          </div>
          <p className="mt-1 text-[#666]">{address}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <Building2 size={16} strokeWidth={1.8} />
            <span>Tipo</span>
          </div>
          <p className="mt-1 text-[#666]">{type}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <Clock size={16} strokeWidth={1.8} />
            <span>Horário</span>
          </div>
          <p className="mt-1 text-[#666]">{schedule}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <FileText size={16} strokeWidth={1.8} />
            <span>Regras</span>
          </div>
          <p className="mt-1 text-[#666]">{rules}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 font-semibold text-[#333]">
          Recursos disponíveis
        </p>

        <div className="flex flex-wrap gap-2">
          {amenities.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#f2f4fb] px-3 py-1.5 text-xs text-[#444]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
