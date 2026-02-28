"use client";

import { Loader, RoomCard, RoomsFilters } from "@/components";
import PopularRooms from "@/components/PopularRooms.component";
import { ROOMS_ROUTE } from "@/constants/routes";
import { useRoomsWithFilters } from "@/hooks/useRoomWithFilters";
import Link from "next/link";
import { useState } from "react";

export default function RoomsPage() {
  const {
    rooms,
    isLoading,
    setAddress,
    handleClearFilters,
    hasFilters,
    orderBy,
    price,
    size,
    totalSpace,
    setOrderBy,
    setPrice,
    setSize,
    setTotalSpace,
    amenitieIds,
    setAmenitieIds,
    handleToggleFavorites,
  } = useRoomsWithFilters("favorites");
  const [location, setLocation] = useState("");

  const hasAnyRoom = rooms.length > 0;

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
        <RoomsFilters
          amenitieIds={amenitieIds}
          setAmenitieIds={setAmenitieIds}
          orderBy={orderBy}
          price={price}
          size={size}
          totalSpace={totalSpace}
          setOrderBy={setOrderBy}
          setPrice={setPrice}
          setSize={setSize}
          setTotalSpace={setTotalSpace}
        />

        <main className="flex flex-col gap-4">
          {/* header */}
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
                  value={location}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocation(value);
                    if (value.length === 0) setAddress(null);
                  }}
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
                  onClick={() => setAddress(location)}
                >
                  Buscar
                </button>
              </div>
            </div>
          </section>

          <div
            className="
                grid grid-cols-3 gap-4
                max-[1100px]:grid-cols-2
                max-[840px]:grid-cols-1
              "
          >
            {isLoading ? (
              <div className="col-span-3">
                <Loader text="Carregando favoritos..." />
              </div>
            ) : (
              rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  mode="view"
                  handleToggleFavorites={handleToggleFavorites}
                />
              ))
            )}
          </div>

          {!hasAnyRoom && !hasFilters && !isLoading && (
            <div>
              <section
                className="
                flex flex-col items-center
                mt-4 w-full rounded-[18px]
                border border-[#e0e0e4]
                bg-white px-8 py-10
                shadow-[0_10px_25px_rgba(15,23,42,0.06)]
              "
              >
                <p className="text-[18px] font-bold text-[#333] mb-2">
                  Nenhuma sala adicionada aos favoritos
                </p>
                <p className="text-[14px] text-[#666] max-w-160">
                  Você ainda não adicionou nenhuma sala aos favoritos, <br />{" "}
                  para que você possa ver as salas, adicione ela aos seus
                  favoritos!
                </p>
                <Link
                  href={ROOMS_ROUTE}
                  className="
                    text-center mt-4 px-6 py-2.5 rounded-full
                    bg-[#e53935] text-white text-[14px] font-semibold
                    transition hover:bg-[#d32f2f] w-100 hover:cursor-pointer
                  "
                >
                  Procurar Salas
                </Link>
              </section>

              <PopularRooms />
            </div>
          )}

          {!hasAnyRoom && hasFilters && !isLoading && (
            <div>
              <section
                className="
                  mt-4 w-full rounded-[18px]
                  border border-[#e0e0e4]
                  bg-white px-8 py-10
                  shadow-[0_10px_25px_rgba(15,23,42,0.06)]
                  flex flex-col items-center text-center gap-3
                "
              >
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

              <PopularRooms />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

