"use client";

import { useMemo } from "react";

type RoomCalendarProps = {
  monthLabel?: string;
  leadingBlanks?: number;
  daysInMonth?: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
};

export function RoomCalendar({
  monthLabel = "Dezembro",
  leadingBlanks = 2,
  daysInMonth = 31,
  selectedDay,
  onSelectDay,
}: RoomCalendarProps) {
  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const cells = useMemo(
    () => [...Array.from({ length: leadingBlanks }, () => null), ...days],
    [days, leadingBlanks]
  );

  return (
    <div className="mt-5 rounded-2xl border border-[#e7e7eb] bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-full px-2 py-1 text-sm text-[#666] hover:bg-[#f7f7fb]"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-[#333]">{monthLabel}</p>
        <button
          type="button"
          className="rounded-full px-2 py-1 text-sm text-[#666] hover:bg-[#f7f7fb]"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-[#888]">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((d, i) => {
          const isBlank = d === null;
          const isSelected = d !== null && d === selectedDay;

          return (
            <button
              key={i}
              type="button"
              disabled={isBlank}
              onClick={() => {
                if (d !== null) onSelectDay(d);
              }}
              className={`
                h-9 rounded-lg border text-xs transition
                ${
                  isBlank
                    ? "border-transparent bg-transparent text-transparent"
                    : "border-[#ececf1] bg-white text-[#444] hover:border-[#e53935]/30 hover:shadow-sm"
                }
                ${isSelected ? "!border-[#e53935] bg-[#e53935] text-white shadow-sm" : ""}
              `}
            >
              {isBlank ? "-" : d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
