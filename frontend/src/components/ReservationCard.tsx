"use client";

import Image from "next/image";
import { Trash2, MapPin, Users } from "lucide-react";

export function ReservationCard({ reservation, onDeleteClick, onDetailsClick }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-5 shadow-sm hover:shadow-md transition-shadow relative border border-gray-100">
      <div className="relative w-36 h-36 shrink-0 rounded-xl overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" alt="" fill className="object-cover" />
      </div>

      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{reservation.title}</h3>
          <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1 mb-4">
            <div className="flex items-center gap-1"><MapPin size={14} /> <span>Belém, Umarizal</span></div>
            <div className="flex items-center gap-1"><Users size={14} /> <span>30 Pessoas</span></div>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {reservation.date} <span className="ml-2 font-bold text-gray-400">{reservation.startTime} - {reservation.endTime}</span>
          </p>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => onDetailsClick(reservation)}
            className="px-5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Detalhes
          </button>
        </div>
      </div>

      <button 
        onClick={() => onDeleteClick(reservation.id)}
        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 border border-gray-100 p-2 rounded-xl hover:bg-red-50 transition-all"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}