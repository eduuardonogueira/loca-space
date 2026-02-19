"use client";

import { IAvailability } from "@/types/availability";
import { IRoomDetails } from "@/types/room";
import { formatRoomAddress } from "@/utils/formatRoomAddress";
import { getWeekdayLabel } from "@/utils/getWeekdayLabel";
import { MapPin, Building2, Clock } from "lucide-react";
import { useMemo } from "react";

type RoomDescriptionProps = {
  roomDetails: IRoomDetails;
};

export function RoomDescription({ roomDetails }: RoomDescriptionProps) {
  const availabilityByDay = useMemo(() => {
    if (!roomDetails.availability?.length) return {};

    return roomDetails.availability.reduce<Record<string, IAvailability[]>>(
      (acc, item) => {
        const dayLabel = getWeekdayLabel(item.weekday);

        if (!acc[dayLabel]) {
          acc[dayLabel] = [];
        }

        acc[dayLabel].push(item);
        return acc;
      },
      {},
    );
  }, [roomDetails.availability]);

  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-[#222]">Descrição do imóvel</h2>

      <p className="mt-4 text-sm leading-relaxed text-[#555]">
        {roomDetails.room.description}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <MapPin size={16} strokeWidth={1.8} />
            <span>Endereço</span>
          </div>
          <p className="mt-1 text-[#666]">
            {formatRoomAddress(roomDetails.room.address)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 font-semibold text-[#333]">
            <Building2 size={16} strokeWidth={1.8} />
            <span>Tipo</span>
          </div>
          <p className="mt-1 text-[#666]">{roomDetails.room.type}</p>
        </div>

        {/* DISPONIBILIDADE */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-[#333] mb-2">
            Horários disponíveis
          </p>

          {Object.keys(availabilityByDay).length === 0 ? (
            <p className="text-xs text-[#777]">Nenhum horário cadastrado</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(availabilityByDay).map(([day, slots]) => (
                <div key={day}>
                  <p className="text-xs font-medium text-[#555] mb-1">{day}</p>

                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <span
                        key={slot.id}
                        className="
                  text-[12px] px-3 py-1 rounded-full
                  border border-[#e7e7eb]
                  bg-[#f9fafb]
                  text-[#444]
                "
                      >
                        {slot.startTime} - {slot.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 font-semibold text-[#333]">Recursos disponíveis</p>

        <div className="flex flex-wrap gap-2">
          {roomDetails.room.amenities?.map((am) => (
            <span
              key={am.id}
              className="rounded-full bg-[#f2f4fb] px-3 py-1.5 text-xs text-[#444]"
            >
              {am.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

