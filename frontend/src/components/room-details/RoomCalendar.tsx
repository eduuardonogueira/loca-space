"use client";

import * as React from "react";

type DateRangeValue = { from?: Date; to?: Date };

type RoomCalendarProps = {
  value: DateRangeValue | undefined;
  onChange: (range: DateRangeValue | undefined) => void;

  // opcionais
  disablePast?: boolean;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetweenInclusive(day: Date, from: Date, to: Date) {
  const t = day.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

export function RoomCalendar({
  value,
  onChange,
  disablePast = false,
}: RoomCalendarProps) {
  const today = startOfDay(new Date());

  const [month, setMonth] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    return startOfDay(d);
  });

  const year = month.getFullYear();
  const m = month.getMonth();

  const monthLabel = month.toLocaleDateString("pt-BR", { month: "long" });

  // ✅ wireframe: começa SEG
  const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

  const daysInMonth = new Date(year, m + 1, 0).getDate();

  // JS getDay(): DOM=0 ... SÁB=6
  // queremos SEG=0 ... DOM=6
  const firstWeekday = new Date(year, m, 1).getDay(); // 0..6 (dom..sab)
  const leadingBlanks = (firstWeekday + 6) % 7; // converte p/ seg como início

  const cells: Array<Date | null> = React.useMemo(() => {
    const arr: Array<Date | null> = [];
    for (let i = 0; i < leadingBlanks; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(startOfDay(new Date(year, m, d)));
    return arr;
  }, [leadingBlanks, daysInMonth, year, m]);

  const from = value?.from ? startOfDay(value.from) : undefined;
  const to = value?.to ? startOfDay(value.to) : undefined;

  function goPrevMonth() {
    const d = new Date(year, m - 1, 1);
    setMonth(startOfDay(d));
  }

  function goNextMonth() {
    const d = new Date(year, m + 1, 1);
    setMonth(startOfDay(d));
  }

  function handlePick(day: Date) {
    const picked = startOfDay(day);

    // 1) sem início → define início
    if (!from) {
      onChange({ from: picked, to: undefined });
      return;
    }

    // 2) tem início e não tem fim → define fim (ou troca)
    if (from && !to) {
      if (picked.getTime() < from.getTime()) {
        onChange({ from: picked, to: from });
      } else if (picked.getTime() === from.getTime()) {
        // clicou no mesmo dia: mantém só início
        onChange({ from: picked, to: undefined });
      } else {
        onChange({ from, to: picked });
      }
      return;
    }

    // 3) já tem range completo → reinicia seleção
    onChange({ from: picked, to: undefined });
  }

  return (
    <div className="mt-5 rounded-2xl border border-[#e7e7eb] bg-white px-6 py-5">
      {/* HEADER */}
      <div className="relative mb-4 flex items-center justify-center">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Mês anterior"
          className="absolute left-0 h-9 w-9 rounded-full flex items-center justify-center text-[#e53935] transition hover:bg-[#fff1f0] active:scale-95"
        >
          ‹
        </button>

        <div className="w-full text-center text-sm font-semibold text-[#e53935] capitalize select-none">
          {monthLabel}
        </div>

        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Próximo mês"
          className="absolute right-0 h-9 w-9 rounded-full flex items-center justify-center text-[#e53935] transition hover:bg-[#fff1f0] active:scale-95"
        >
          ›
        </button>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 pb-2 text-center text-[11px] font-medium text-[#777]">
        {weekDays.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-y-2">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`blank-${idx}`} className="h-10 w-10" />;
          }

          const isPast = disablePast && day.getTime() < today.getTime();
          const isStart = from && sameDay(day, from);
          const isEnd = to && sameDay(day, to);
          const inRange = from && to && isBetweenInclusive(day, from, to);
          const inMiddle = inRange && !isStart && !isEnd;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => handlePick(day)}
              className={[
                "mx-auto h-10 w-10 text-[13px] font-medium transition",
                "focus:outline-none",
                isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-[#fff1f0] hover:text-[#e53935]",
                // padrão
                !inRange ? "rounded-lg text-[#333]" : "",
                // faixa do meio
                inMiddle ? "bg-[#ffd9d6] text-[#333] rounded-none" : "",
                // início/fim
                isStart && !to ? "bg-[#e53935] text-white rounded-full" : "",
                isStart && to ? "bg-[#e53935] text-white rounded-l-full" : "",
                isEnd ? "bg-[#e53935] text-white rounded-r-full" : "",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
