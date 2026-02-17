"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  Share2,
  Users,
  Ruler,
  Wifi,
  Monitor,
  Car,
  Video,
} from "lucide-react";
import { RoomCalendar } from "./RoomCalendar";
import type { DateRange } from "react-day-picker";

type RoomBookingCardProps = {
  price?: number;
  email?: string;
  advertiser?: string;
  chips?: string[];
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatPtBR(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

function daysBetweenInclusive(from: Date, to: Date) {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  const diff = Math.round((b - a) / 86400000);
  return diff + 1;
}

export function RoomBookingCard({
  price = 1300,
  email = "workingplus@gmail.com",
  advertiser = "Working Plus",
  chips = ["10 Pessoas", "22 m²", "WiFi", "TV", "3 Vagas", "Projetor"],
}: RoomBookingCardProps) {
  // ✅ seleção livre: 1 dia ou vários dias
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  // ✅ normaliza: se tiver to < from, inverte
  const normalizedRange = useMemo<DateRange | undefined>(() => {
    if (!range?.from) return undefined;
    if (!range.to) return { from: startOfDay(range.from), to: undefined };

    const from = startOfDay(range.from);
    const to = startOfDay(range.to);

    if (to.getTime() < from.getTime()) return { from: to, to: from };
    return { from, to };
  }, [range]);

  function getChipIcon(label: string) {
    const lower = label.toLowerCase();
    if (lower.includes("pessoa")) return <Users size={14} strokeWidth={1.8} />;
    if (label.includes("m²")) return <Ruler size={14} strokeWidth={1.8} />;
    if (lower.includes("wifi")) return <Wifi size={14} strokeWidth={1.8} />;
    if (lower.includes("tv")) return <Monitor size={14} strokeWidth={1.8} />;
    if (lower.includes("vaga")) return <Car size={14} strokeWidth={1.8} />;
    if (lower.includes("projetor")) return <Video size={14} strokeWidth={1.8} />;
    return null;
  }

  const rangeText = useMemo(() => {
    if (!normalizedRange?.from) return "nenhum";
    // ✅ 1 dia: from sem to
    if (!normalizedRange.to) return formatPtBR(normalizedRange.from);
    // ✅ vários dias
    return `${formatPtBR(normalizedRange.from)} - ${formatPtBR(normalizedRange.to)}`;
  }, [normalizedRange]);

  const totalDays = useMemo(() => {
    if (!normalizedRange?.from) return 0;
    // ✅ 1 dia conta como 1
    if (!normalizedRange.to) return 1;
    return daysBetweenInclusive(normalizedRange.from, normalizedRange.to);
  }, [normalizedRange]);

  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      {/* VALOR + AÇÕES */}
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
            <Heart size={18} strokeWidth={1.8} />
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
            <Share2 size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* EMAIL E ANUNCIANTE */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-[#666]">
          <span className="font-medium text-[#333]">Email:</span>
          <span className="text-right">{email}</span>
        </div>

        <div className="flex justify-between text-[#666]">
          <span className="font-medium text-[#333]">Anunciante:</span>
          <span className="text-right">{advertiser}</span>
        </div>
      </div>

      {/* CHIPS COM ÍCONES */}
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
            {getChipIcon(chip)}
            <span>{chip}</span>
          </span>
        ))}
      </div>

      {/* CALENDÁRIO */}
      <RoomCalendar value={normalizedRange} onChange={setRange} />

      {/* BOTÃO (✅ não bloqueia; só desativa se não escolher nada) */}
      <button
        type="button"
        disabled={!normalizedRange?.from}
        className="
          mt-5 h-12 w-full rounded-full bg-[#e53935]
          text-sm font-semibold text-white
          shadow-[0_10px_18px_rgba(229,57,53,0.25)]
          transition hover:bg-[#d32f2f] active:translate-y-[1px]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e53935]
        "
      >
        Enviar Mensagem
      </button>

      <div className="mt-3 text-center text-xs text-[#777]">
        <div>
          Dias selecionados:{" "}
          <span className="font-semibold text-[#444]">{rangeText}</span>
        </div>

        {totalDays > 0 ? (
          <div className="mt-1 text-[#999]">
            Total:{" "}
            <span className="font-semibold text-[#666]">{totalDays}</span>{" "}
            dia(s)
          </div>
        ) : null}
      </div>
    </div>
  );
}
