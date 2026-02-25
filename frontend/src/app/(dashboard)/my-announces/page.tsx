"use client";

import React, { useMemo, useState } from "react";
import { Loader, RoomCard, RoomsFilters } from "@/components";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { ArrowRight } from "lucide-react";
import { CREATE_ROOM_ROUTE } from "@/constants/routes";
import Link from "next/link";
import { IFilterRange } from "@/hooks/useRoomWithFilters";

const DEFAULT_RANGE_VALUE: IFilterRange = {
  max: null,
  min: null,
};

export default function RoomsPage() {
  const { rooms, isLoading } = useAnnouncement();

  const [orderBy, setOrderBy] = useState<string | null>("data-recente");
  const [amenitieIds, setAmenitieIds] = useState<number[]>([]);
  const [price, setPrice] = useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [size, setSize] = useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [totalSpace, setTotalSpace] = useState<IFilterRange>(DEFAULT_RANGE_VALUE);
  const [locationQuery, setLocationQuery] = useState("");

  const hasAnyRoom = rooms.length > 0;

  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    if (locationQuery.trim()) {
      const query = locationQuery.toLowerCase();

      filtered = filtered.filter((room) =>
        `${room.address?.city} ${room.address?.state}`
          .toLowerCase()
          .includes(query),
      );
    }

    if (amenitieIds.length > 0) {
      filtered = filtered.filter((room) =>
        amenitieIds.every((amenityId) =>
          room.amenities?.some((amenity) => amenity.id === amenityId),
        ),
      );
    }

    if (price.min) filtered = filtered.filter((room) => room.price >= price.min!);
    if (price.max) filtered = filtered.filter((room) => room.price <= price.max!);
    if (size.min) filtered = filtered.filter((room) => room.size >= size.min!);
    if (size.max) filtered = filtered.filter((room) => room.size <= size.max!);
    if (totalSpace.min)
      filtered = filtered.filter((room) => room.totalSpace >= totalSpace.min!);
    if (totalSpace.max)
      filtered = filtered.filter((room) => room.totalSpace <= totalSpace.max!);

    filtered.sort((a, b) => {
      if (orderBy === "maior-preço") return b.price - a.price;
      if (orderBy === "menor-preço") return a.price - b.price;
      if (orderBy === "data-recente") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (orderBy === "data-antiga") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return 0;
    });

    return filtered;
  }, [rooms, orderBy, amenitieIds, locationQuery, price, size, totalSpace]);

  const hasFilteredRooms = filteredRooms.length > 0;

  function handleClearFilters() {
    setLocationQuery("");
    setAmenitieIds([]);
    setOrderBy("data-recente");
    setPrice(DEFAULT_RANGE_VALUE);
    setSize(DEFAULT_RANGE_VALUE);
    setTotalSpace(DEFAULT_RANGE_VALUE);
  }

  function handleToggleFavorites() {
    // página de anúncios não usa favorito no fluxo atual
  }

  if (isLoading) return <Loader text="Carregando salas..." />;

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
          amenitieIds={amenitieIds}
          price={price}
          size={size}
          totalSpace={totalSpace}
          setOrderBy={setOrderBy}
          setPrice={setPrice}
          setSize={setSize}
          setTotalSpace={setTotalSpace}
          setAmenitieIds={setAmenitieIds}
        />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex flex-col gap-4">
          {/* Barra de localização */}
          <section
            className="
              bg-white rounded-2xl
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
                    active:translate-y-px
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
              <p className="text-[14px] text-[#666] max-w-160">
                Ainda não há salas anunciadas na plataforma. Assim que alguém
                anunciar, elas aparecerão aqui.
              </p>

              <Link
                href={CREATE_ROOM_ROUTE}
                className="
                w-full h-9 rounded-full mt-2
                bg-[#e53935] text-[13px] font-semibold
                text-white
                flex items-center justify-center gap-2
                transition hover:bg-[#d32f2f]
              "
              >
                Criar Anúncio
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>
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
                <p className="text-[14px] text-[#666] max-w-120">
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
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    mode="edit"
                    handleToggleFavorites={handleToggleFavorites}
                  />
                ))}
              </div>
            </>
          )}

          {hasAnyRoom && hasFilteredRooms && (
            <div
              className="
                grid grid-cols-3 gap-4
                max-[1100px]:grid-cols-2
                max-[840px]:grid-cols-1
              "
            >
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  mode="edit"
                  handleToggleFavorites={handleToggleFavorites}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
