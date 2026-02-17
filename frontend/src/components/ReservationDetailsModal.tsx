"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MapPin, Calendar, Clock, Users, Ruler, Warehouse, Car, Wifi, Presentation, Trash2, ChevronRight } from "lucide-react";

export function ReservationDetailsModal({ isOpen, onClose, reservation, onCancelClick }: any) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070"
  ];

  if (!isOpen || !reservation) return null;

  const handleCancelAction = () => {
    onClose(); 
    setTimeout(() => {
      onCancelClick(reservation.id);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 z-30 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white text-gray-500">
          <X size={18} />
        </button>

        {/* Galeria de Fotos Lateral */}
        <div className="relative h-56 w-full flex gap-1 p-1 bg-gray-50 font-sans">
          <div className="relative flex-[2] rounded-l-2xl overflow-hidden">
            <Image src={images[currentImg]} alt="" fill className="object-cover" />
          </div>
          <div className="relative flex-1 rounded-r-2xl overflow-hidden cursor-pointer group" onClick={() => setCurrentImg((currentImg + 1) % images.length)}>
            <Image src={images[(currentImg + 1) % images.length]} alt="" fill className="object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/10 transition-all">
              <ChevronRight size={32} className="text-white drop-shadow-md" />
            </div>
          </div>
        </div>

        <div className="p-8 font-sans">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{reservation.title}</h2>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-6">
            <MapPin size={12} />
            <span>R. Municipalidade, nº 985 - Umarizal, Belém - PA, 66050-350</span>
          </div>

          <div className="flex gap-8 mb-8 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2"><Calendar size={16} /> {reservation.date}</div>
            <div className="flex items-center gap-2 text-gray-400"><Clock size={16} /> {reservation.startTime} - {reservation.endTime}</div>
          </div>

          {/* Grid de Atributos */}
          <div className="grid grid-cols-2 gap-y-4 border-t border-gray-100 pt-6 mb-6 text-[11px] font-bold text-gray-600">
            <div className="flex items-center gap-3"><Users size={18} className="text-gray-300" /> 30 Pessoas</div>
            <div className="flex items-center gap-3"><Ruler size={18} className="text-gray-300" /> 22 m²</div>
            <div className="flex items-center gap-3"><Warehouse size={18} className="text-gray-300" /> 1 Banheiro</div>
            <div className="flex items-center gap-3"><Car size={18} className="text-gray-300" /> 5 Vagas</div>
            <div className="flex items-center gap-3"><Wifi size={18} className="text-gray-300" /> Wifi</div>
            <div className="flex items-center gap-3"><Presentation size={18} className="text-gray-300" /> Projetor</div>
          </div>

          {/* Preço */}
          <div className="text-left mb-8">
            <p className="text-2xl font-black text-gray-900 tracking-tight">R$ 1.000</p>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={handleCancelAction}
              className="w-full py-3.5 bg-[#E85D46] hover:bg-[#d14d3a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-50"
            >
              <Trash2 size={18} /> Cancelar
            </button>
            <button className="w-full py-3.5 bg-[#B0B0B0] hover:bg-[#9a9a9a] text-white font-bold rounded-xl transition-all">
              Página do Anúncio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}