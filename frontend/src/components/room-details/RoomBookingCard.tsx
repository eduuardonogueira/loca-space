"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { IRoomDetails } from "@/types/room";
import { RoomCalendar } from "./RoomCalendar";
import { toast } from "react-toastify";
import { createAppointment } from "@/services/appointments";
import { CreateAppointmentPayload } from "@/types/appointment";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

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

interface IRoomBookingCardProps {
  roomDetails: IRoomDetails;
}

export function RoomBookingCard({ roomDetails }: IRoomBookingCardProps) {
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedRange = useMemo<DateRange | undefined>(() => {
    if (!range?.from) return undefined;
    if (!range.to) return { from: startOfDay(range.from), to: undefined };
    const from = startOfDay(range.from);
    const to = startOfDay(range.to);
    return to < from ? { from: to, to: from } : { from, to };
  }, [range]);

  const rangeText = useMemo(() => {
    if (!normalizedRange?.from) return "nenhum";
    if (!normalizedRange.to) return formatPtBR(normalizedRange.from);
    return `${formatPtBR(normalizedRange.from)} - ${formatPtBR(normalizedRange.to)}`;
  }, [normalizedRange]);

  const totalDays = useMemo(() => {
    if (!normalizedRange?.from) return 0;
    if (!normalizedRange.to) return 1;
    return daysBetweenInclusive(normalizedRange.from, normalizedRange.to);
  }, [normalizedRange]);

  const calculateBookingPrice = () => {
    if (!normalizedRange?.from) return 0;
    if (!startTime || !endTime) return 0;

    const startDateTime = new Date(
      `${normalizedRange.from.toISOString().split("T")[0]}T${startTime}`,
    ).toISOString();
    const endDateTime = new Date(
      `${(normalizedRange.to ?? normalizedRange.from).toISOString().split("T")[0]}T${endTime}`,
    ).toISOString();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) return 0;

    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const pricePerHour = roomDetails.room.price;

    const totalPrice = diffHours * pricePerHour;

    return totalPrice;
  };

  function makeLocalDateTime(date: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hours - 3, minutes, 0, 0);
    return d.toISOString();
  }

  const handleCreateAppointment = async () => {
    if (!normalizedRange?.from)
      return toast.error("Selecione a data de início.");
    if (!startTime || !endTime)
      return toast.error("Informe o horário inicial e final.");

    if (!title) return toast.error("Informe o um título para seu agendamento.");
    if (!details)
      return toast.error("Informe o uma descrição para seu agendamento.");

    const startDateTime = makeLocalDateTime(normalizedRange.from, startTime);
    const endDateTime = makeLocalDateTime(
      normalizedRange.to ?? normalizedRange.from,
      endTime,
    );

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      return toast.error("A data/hora final precisa ser maior que a inicial.");
    }

    const payload: CreateAppointmentPayload = {
      status: "PENDING",
      startDateTime,
      endDateTime,
      details,
      title,
      roomId: roomDetails.room.id,
      price: roomDetails.room.price,
      totalValue: calculateBookingPrice(),
    };

    setIsSubmitting(true);
    try {
      const response = await createAppointment(payload);

      if (response.id) {
        toast.success("Agendamento criado com sucesso!");
        router.refresh();
      } else {
        toast.error("Erro ao criar agendamento");
      }
    } catch (err) {
      toast.error("Erro inesperado ao criar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      {/* VALOR + AÇÕES */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#666]">Valor</p>
          <p className="mt-1 text-xl font-semibold text-[#222]">
            R$ {roomDetails.room.price.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Favoritar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7e7eb] bg-white text-[#333] shadow-sm transition hover:bg-[#f7f7fb] active:scale-95"
          >
            <Heart size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Compartilhar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7e7eb] bg-white text-[#333] shadow-sm transition hover:bg-[#f7f7fb] active:scale-95"
          >
            <Share2 size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* DETALHES */}
      <div className="mt-4 flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Título do agendamento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <Textarea
          placeholder="Detalhes do agendamento"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* CALENDÁRIO */}
      <div className="mt-4">
        <RoomCalendar
          value={normalizedRange}
          onChange={setRange as any}
          disablePast
        />
      </div>

      {/* HORÁRIOS */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="block text-sm font-medium text-[#333]">
            Horário de Início:
          </Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded border px-2 py-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="block text-sm font-medium text-[#333]">
            Horário Fim:
          </Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded border px-2 py-1"
          />
        </div>
      </div>

      {/* Total */}
      <div className="flex w-full justify-between items-center mt-4 font-bold">
        <p>Total:</p>
        <p>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(calculateBookingPrice())}{" "}
        </p>
      </div>

      {/* BOTÃO DE AGENDAMENTO */}
      <button
        type="button"
        disabled={
          !normalizedRange?.from || !startTime || !endTime || isSubmitting
        }
        onClick={handleCreateAppointment}
        className="mt-5 h-12 w-full rounded-full bg-[#e53935] text-sm font-semibold text-white shadow-[0_10px_18px_rgba(229,57,53,0.25)] transition hover:bg-[#d32f2f] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Agendando..." : "Criar Agendamento"}
      </button>

      <div className="mt-3 text-center text-xs text-[#777]">
        <div>
          Dias selecionados:{" "}
          <span className="font-semibold text-[#444]">{rangeText}</span>
        </div>
        {totalDays > 0 && (
          <div className="mt-1 text-[#999]">
            Total:{" "}
            <span className="font-semibold text-[#666]">{totalDays}</span>{" "}
            dia(s)
          </div>
        )}
      </div>
    </div>
  );
}

