"use client";

import React, { useState, useEffect } from "react";
import {
  RoomBookingCard,
  RoomDescription,
  RoomGallery,
} from "@/components/room-details";

// 1. Importamos o nosso tradutor e os tipos!
import { mapApiRoomToCardRoom } from "@/mappers/room.mapper";
import type { IRoomWithAmenities } from "@/types/room";
import type { Room } from "@/components"; // Ajuste o caminho de importação do Room se precisar

type RoomDetailsViewProps = {
  roomId: string;
};

export function RoomDetailsView({ roomId }: RoomDetailsViewProps) {
  // 2. Nossas "caixas" de estado para a API
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. O nosso "Garçom" que busca os detalhes de uma sala específica
  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        setIsLoading(true);
        // Usamos o nosso atalho que ignora o CORS passando o ID na URL!
        const response = await fetch(`/api-backend/room/${roomId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
             throw new Error("Sala não encontrada.");
          }
          throw new Error("Erro ao buscar detalhes da sala.");
        }

        const data: IRoomWithAmenities = await response.json();
        
        // 4. Passamos a sala pelo tradutor
        const formattedRoom = mapApiRoomToCardRoom(data);
        setRoom(formattedRoom);
        
      } catch (err: any) {
        console.error("Erro ao buscar detalhes:", err);
        setError(err.message || "Não foi possível carregar os detalhes.");
      } finally {
        setIsLoading(false);
      }
    }

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // 5. Telas de Loading e Erro
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6] flex items-center justify-center">
        <p className="text-[#666] font-semibold text-lg">Carregando detalhes da sala...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-8">
          <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
            <p className="text-[16px] font-semibold text-red-600">
              {error || "Sala não encontrada"}
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Verifique se o link está correto ou volte para a listagem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 6. Galeria de Imagens (Mantida a sua lógica de fallback)
  const galleryImages = [
    room.imageUrl,
    "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ];

  // 7. Renderização da Tela com os dados reais!
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-[#222]">
          {room.title}
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="flex flex-col gap-6">
            <RoomGallery images={galleryImages} />

            <RoomDescription
              description={room.description}
              address={room.address}
              type={room.type}
              rules={room.rules}
              schedule={room.schedule}
              amenities={room.amenities}
            />
          </section>

          <aside className="h-fit lg:sticky lg:top-6">
            <RoomBookingCard
              price={room.price}
              advertiser="Locador Responsável" // Ainda estático, pois a API não retorna os dados do 'userId'
              email="contato@locaspace.com"    // Idem
              chips={[
                `${room.capacity} Pessoas`,
                `${room.area} m²`,
                ...room.amenities,
              ]}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}