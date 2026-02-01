"use client";

import "./home.style.css";
import React, { useMemo, useState } from "react";
import {
  RoomCard,
  RoomsFilters,
  type Room,
  type OrderBy,
} from "@/components";

// MOCK local só para desenvolvimento.
// Depois é só trocar pelo array vindo da API (ex: rooms do useHomeData).
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

export default function HomePage() {
  const [orderBy, setOrderBy] = useState<OrderBy>("recent");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");

  const hasAnyRoom = allRooms.length > 0;

  const filteredRooms = useMemo(() => {
    let rooms = [...allRooms];

    // filtro por localização
    if (locationQuery.trim()) {
      const query = locationQuery.toLowerCase();
      rooms = rooms.filter((room) =>
        room.location.toLowerCase().includes(query)
      );
    }

    // filtro por recursos
    if (selectedAmenities.length > 0) {
      rooms = rooms.filter((room) =>
        selectedAmenities.every((am) => room.amenities.includes(am))
      );
    }

    // ordenação
    rooms.sort((a, b) => {
      if (orderBy === "higherPrice") return b.price - a.price;
      if (orderBy === "lowerPrice") return a.price - b.price;
      return 0; // "recent" (por enquanto usa ordem original)
    });

    return rooms;
  }, [orderBy, selectedAmenities, locationQuery]);

  const hasFilteredRooms = filteredRooms.length > 0;

  function handleToggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  function handleClearFilters() {
    setLocationQuery("");
    setSelectedAmenities([]);
    setOrderBy("recent");
  }

  return (
    <div className="ls-page">
      <div className="ls-content">
        {/* SIDEBAR */}
        <RoomsFilters
          orderBy={orderBy}
          onChangeOrderBy={setOrderBy}
          selectedAmenities={selectedAmenities}
          onToggleAmenity={handleToggleAmenity}
        />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="ls-main">
          {/* Barra de localização */}
          <section className="ls-location-bar">
            <div className="ls-location-input-wrapper">
              <span className="ls-location-label">Localização</span>
              <div className="ls-location-input-row">
                <input
                  type="text"
                  className="ls-location-input"
                  placeholder="Ex: Belém - PA"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                <button className="ls-location-search-button">Buscar</button>
              </div>
            </div>
          </section>

          {/* 1) BANCO VAZIO (nenhuma sala cadastrada) */}
{!hasAnyRoom && (
  <section className="ls-empty">
    {/* Se quiser, reaproveita o mesmo ícone que você usar no empty-state geral */}
    {/* <img src="/imgs/empty-rooms.svg" alt="" className="ls-empty-image" /> */}

    <h2 className="ls-empty-title">Nenhuma sala cadastrada ainda</h2>
    <p className="ls-empty-subtitle">
      Ainda não há salas anunciadas na plataforma. Assim que alguém anunciar,
      elas aparecerão aqui.
    </p>
  </section>
)}

{/* 2) TEM SALA, MAS FILTRO NÃO ACHOU NADA */}
{hasAnyRoom && !hasFilteredRooms && (
  <>
    <section className="ls-empty">
      {/* mesmo ícone, se quiser */}
      {/* <img src="/imgs/empty-rooms.svg" alt="" className="ls-empty-image" /> */}

      <h2 className="ls-empty-title">Nenhuma sala disponível</h2>
      <p className="ls-empty-subtitle">
        Não encontramos salas com os filtros selecionados. Tente remover alguns
        filtros ou ajustar a busca.
      </p>

      <button
        type="button"
        className="ls-empty-button"
        onClick={handleClearFilters}
      >
        Limpar filtros
      </button>
    </section>

    <h2 className="ls-section-title">Mais procurados na sua região</h2>

    <div className="ls-cards-grid">
      {allRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  </>
)}

          {/* 3) LISTA NORMAL (filtro com resultado) */}
          {hasAnyRoom && hasFilteredRooms && (
            <div className="ls-cards-grid">
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
