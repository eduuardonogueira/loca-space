"use client";

import React, { useMemo, useState } from "react";
import { RoomCard, RoomsFilters, type Room, type OrderBy } from "@/components";

const allRooms: Room[] = [
  {
    id: 1,
    title: "Sala de Reunião - Prédio Executivo",
    location: "Belém - PA",
    price: 1000,
    imageUrl:
      "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=800",
    area: 22,
    capacity: 8,
    amenities: ["Wi-Fi", "Projetor", "Climatizada"],
  },
  {
    id: 2,
    title: "Sala Industrial - Condomínio",
    location: "Ananindeua - PA",
    price: 850,
    imageUrl:
      "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=800",
    area: 32,
    capacity: 12,
    amenities: ["Wi-Fi", "Garagem"],
  },
  {
    id: 3,
    title: "Sala de Treinamento - Coworking",
    location: "Belém - PA",
    price: 950,
    imageUrl:
      "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg",
    area: 28,
    capacity: 15,
    amenities: ["Wi-Fi", "Ar-condicionado"],
  },
];

export default function RoomsPage() {
  const [orderBy, setOrderBy] = useState<OrderBy>("recent");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");

  const hasAnyRoom = allRooms.length > 0;

  const filteredRooms = useMemo(() => {
    let rooms = [...allRooms];

    if (locationQuery.trim()) {
      const query = locationQuery.toLowerCase();
      rooms = rooms.filter((room) =>
        room.location.toLowerCase().includes(query),
      );
    }

    if (selectedAmenities.length > 0) {
      rooms = rooms.filter((room) =>
        selectedAmenities.every((am) => room.amenities.includes(am)),
      );
    }

    rooms.sort((a, b) => {
      if (orderBy === "higherPrice") return b.price - a.price;
      if (orderBy === "lowerPrice") return a.price - b.price;
      return 0;
    });

    return rooms;
  }, [orderBy, selectedAmenities, locationQuery]);

  const hasFilteredRooms = filteredRooms.length > 0;

  function handleToggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }

  function handleClearFilters() {
    setLocationQuery("");
    setSelectedAmenities([]);
    setOrderBy("recent");
  }

  return (
    <div
      className="
        min-h-[calc(100vh-64px)]
        bg-[#f4f4f6] text-[#222] pb-6
        font-sans
      "
    >
      <div
        className="
          grid grid-cols-[280px_minmax(0,1fr)]
          gap-6 px-10 pt-6 pb-10
          max-[1100px]:grid-cols-[240px_minmax(0,1fr)]
          max-[840px]:grid-cols-[minmax(0,1fr)]
          max-[840px]:px-4
        "
      >
        {/* SIDEBAR */}
        <RoomsFilters
          orderBy={orderBy}
          onChangeOrderBy={setOrderBy}
          selectedAmenities={selectedAmenities}
          onToggleAmenity={handleToggleAmenity}
        />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex flex-col gap-4">
          {/* Barra de localização */}
          <section
            className="
              bg-white rounded-[16px]
              px-4 py-3.5
              shadow-[0_8px_18px_rgba(15,23,42,0.04)]
              border border-[#e0e0e4]
            "
          >
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-[#444]">
                Localização
              </span>

              <div
                className="
                  flex gap-2.5 mt-1
                  max-[600px]:flex-col
                "
              >
                <input
                  type="text"
                  className="
                    flex-1 h-10 rounded-[10px]
                    border border-[#dde0ea]
                    px-3 text-[13px]
                    bg-white
                    focus:outline-none
                    focus:border-[#e53935]
                    focus:ring-1 focus:ring-[#e53935]/40
                  "
                  placeholder="Ex: Belém - PA"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />

                <button
                  type="button"
                  className="
                    h-10 px-6 rounded-[10px]
                    bg-[#e53935] text-white font-semibold text-[13px]
                    flex items-center justify-center
                    cursor-pointer
                    transition
                    hover:bg-[#d32f2f]
                    hover:shadow-[0_4px_10px_rgba(211,47,47,0.4)]
                    active:translate-y-[1px]
                    active:shadow-[0_2px_5px_rgba(211,47,47,0.3)]
                    max-[600px]:w-full
                  "
                >
                  Buscar
                </button>
              </div>
            </div>
          </section>

          {/* 1) Banco vazio */}
          {!hasAnyRoom && (
            <section
              className="
                mt-4 w-full rounded-[18px]
                border border-[#e0e0e4]
                bg-white px-8 py-10
                shadow-[0_10px_25px_rgba(15,23,42,0.06)]
              "
            >
              <p className="text-[18px] font-bold text-[#333] mb-2">
                Nenhuma sala cadastrada ainda
              </p>
              <p className="text-[14px] text-[#666] max-w-[640px]">
                Ainda não há salas anunciadas na plataforma. Assim que alguém
                anunciar, elas aparecerão aqui.
              </p>
            </section>
          )}

          {/* 2) Tem sala, mas os filtros não retornaram nada */}
          {hasAnyRoom && !hasFilteredRooms && (
            <>
              <section
                className="
                  mt-4 w-full rounded-[18px]
                  border border-[#e0e0e4]
                  bg-white px-8 py-10
                  shadow-[0_10px_25px_rgba(15,23,42,0.06)]
                  flex flex-col items-center text-center gap-3
                "
              >
                {/* Se quiser, mantém seu ícone aqui */}
                <p className="text-[18px] font-bold text-[#333]">
                  Nenhuma sala disponível
                </p>
                <p className="text-[14px] text-[#666] max-w-[480px]">
                  Não encontramos salas com os filtros selecionados. Tente
                  remover alguns filtros ou ajustar a busca.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="
                    mt-2 px-6 py-2.5 rounded-full
                    bg-[#e53935] text-white text-[14px] font-semibold
                    transition hover:bg-[#d32f2f]
                  "
                >
                  Limpar filtros
                </button>
              </section>

              <h2 className="text-[14px] font-semibold text-[#444] mt-6 mb-3">
                Mais procurados na sua região
              </h2>

              <div
                className="
                  grid grid-cols-3 gap-4
                  max-[1100px]:grid-cols-2
                  max-[840px]:grid-cols-1
                "
              >
                {allRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </>
          )}

          {/* 3) Lista normal */}
          {hasAnyRoom && hasFilteredRooms && (
            <div
              className="
                grid grid-cols-3 gap-4
                max-[1100px]:grid-cols-2
                max-[840px]:grid-cols-1
              "
            >
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

