"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EnumRoomType, RoomTypeLabels } from "@/types/room";
import { Input } from "@/components/ui/input";
import { House, MapPin, Pointer } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (address) params.append("address", address);
    if (roomType) params.append("type", roomType);

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <main className="h-[calc(100vh-80px)] flex flex-col font-sans relative overflow-hidden">
      {/* Imagem de Fundo (Fixa) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
          alt="Sala de Reunião Coworking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* --- CONTEÚDO HERO --- */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16">
        <div className="w-full max-w-300 mx-auto mb-10">
          <h1 className="text-white text-4xl md:text-[56px] font-bold mb-4 drop-shadow-lg leading-tight">
            Encontre a sala <br /> ideal para você
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold drop-shadow-md">
            Conte com a LocaSpace na sua Jornada
          </p>
        </div>

        {/* CARD DE BUSCA */}
        <div className="bg-white rounded-[10px] p-6 md:p-8 shadow-xl w-full max-w-300 mx-auto">
          <div className="flex flex-col md:flex-row gap-5 items-end">
            <div className="flex-1 w-full">
              <Label className="flex items-center gap-2 text-md font-bold text-gray-900 mb-3">
                <MapPin />
                Localidade
              </Label>
              <Input
                type="text"
                placeholder="Digite a cidade, bairro ou rua"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-14 border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#E85D46] focus:ring-4 focus:ring-[#E85D46]/10"
              />
            </div>

            {/* Input Tipo de Sala */}
            <div className="flex-1 w-full">
              <Label
                htmlFor="type"
                className="flex items-center gap-2 text-md font-bold text-gray-900 mb-3"
              >
                <House />
                Tipo de espaço
              </Label>
              <Select onValueChange={(value) => setRoomType(value)}>
                <SelectTrigger size="lg" className='w-full' id="type">
                  <SelectValue placeholder="Selecione o tipo" className='h-30'/>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EnumRoomType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {RoomTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão Pesquisar */}
            <button
              onClick={handleSearch}
              className="h-14 w-15 bg-[#E85D46] text-white rounded-lg flex items-center justify-center shrink-0 shadow-md transition-all duration-300 ease-out hover:bg-[#ff6b52] hover:shadow-[0_8px_20px_-6px_rgba(232,93,70,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:shadow-inner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

