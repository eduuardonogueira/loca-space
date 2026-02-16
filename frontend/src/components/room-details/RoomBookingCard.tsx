"use client";

import { useState } from "react";
import { RoomCalendar } from "./RoomCalendar";

type RoomBookingCardProps = {
  price?: number;
  email?: string;
  advertiser?: string;
  chips?: string[];
};

export function RoomBookingCard({
  price = 1300,
  email = "workingplus@gmail.com",
  advertiser = "Working Plus",
  chips = ["10 Pessoas", "22 m²", "WiFi", "TV", "3 Vagas", "Projetor"],
}: RoomBookingCardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(10);

  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#666]">Valor</p>
          <p className="mt-1 text-xl font-semibold text-[#222]">
            R$ {price.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Favoritar"
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-[#e7e7eb] bg-white text-[#333] shadow-sm
              transition hover:bg-[#f7f7fb] active:scale-95
            "
          >
            ❤
          </button>
          <button
            type="button"
            aria-label="Compartilhar"
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-[#e7e7eb] bg-white text-[#333] shadow-sm
              transition hover:bg-[#f7f7fb] active:scale-95
            "
          >
            ↗
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm text-[#666]">
        <p>
          <span className="font-medium text-[#333]">Email:</span> {email}
        </p>
        <p>
          <span className="font-medium text-[#333]">Anunciante:</span>{" "}
          {advertiser}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-[#e7e7eb] bg-white px-3 py-1
              text-[12px] leading-none text-[#444]
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e53935]" />
            {chip}
          </span>
        ))}
      </div>

      <RoomCalendar
        monthLabel="Dezembro"
        leadingBlanks={2}
        daysInMonth={31}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <button
        type="button"
        className="
          mt-5 h-12 w-full rounded-full bg-[#e53935]
          text-sm font-semibold text-white
          shadow-[0_10px_18px_rgba(229,57,53,0.25)]
          transition hover:bg-[#d32f2f] active:translate-y-[1px]
        "
      >
        Enviar Mensagem
      </button>

      <p className="mt-3 text-center text-xs text-[#777]">
        Dia selecionado:{" "}
        <span className="font-semibold text-[#444]">
          {selectedDay ?? "nenhum"}
        </span>
      </p>
    </div>
  );
}
