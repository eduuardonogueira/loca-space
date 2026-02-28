"use client";

import { Loader, RoomCard, AnnouncesFilters } from "@/components";
import PopularRooms from "@/components/PopularRooms.component";
import { CREATE_ROOM_ROUTE } from "@/constants/routes";
import { useMyAnnouncement } from "@/hooks/useMyAnnouncement";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RoomsPage() {
  const {
    rooms,
    isLoading,
    name,
    setName,
    status,
    setStatus,
    handleClearFilters,
    hasFilters,
    orderBy,
    setOrderBy,
    amenitieIds,
    setAmenitieIds,
    handleToggleFavorites,
    type,
    setType,
  } = useMyAnnouncement();
  const [roomName, setRoomName] = useState("");

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
        <AnnouncesFilters
          orderBy={orderBy}
          amenitieIds={amenitieIds}
          status={status}
          setOrderBy={setOrderBy}
          setAmenitieIds={setAmenitieIds}
          setStatus={setStatus}
          type={type}
          setType={setType}
        />

        <main className="flex flex-col gap-4">
          {/* header */}
          <section
            className="
              bg-white rounded-2xl
              px-4 py-3.5
              shadow-[0_8px_18px_rgba(15,23,42,0.04)]
              border border-gray-300
            "
          >
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-[#444]">
                Bucar por Nome
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
                    focus:border-primary
                    focus:ring-1 focus:ring-primary/40
                  "
                  placeholder="Escritório 204..."
                  value={roomName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRoomName(value);
                    if (value.length === 0) setName(null);
                  }}
                />

                <button
                  type="button"
                  className="
                    h-10 px-6 rounded-[10px]
                    bg-primary text-white font-semibold text-[13px]
                    flex items-center justify-center
                    cursor-pointer
                    transition
                    hover:bg-primary-hover
                    active:translate-y-px
                    active:shadow-[0_2px_5px_rgba(211,47,47,0.3)]
                    max-[600px]:w-full
                  "
                  onClick={() => setName(name)}
                >
                  Buscar
                </button>
              </div>
            </div>
          </section>

          <div className="flex">
            {isLoading ? (
              <div className="flex w-full justify-center">
                <Loader text="Carregando salas..." />
              </div>
            ) : (
              <div
                className="            
                  grid grid-cols-3 gap-4
                  max-[1100px]:grid-cols-2
                  max-[840px]:grid-cols-1
                "
              >
                <Link
                  className={`
                    w-full h-full bg-gray-50 
                    shadow rounded-[14px] overflow-hidden
                    border border-gray-200
                    flex flex-col items-center justify-center
                    transition hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)]
                    hover:-translate-y-1
                    duration-200 gap-2
                    cursor-pointer ${!hasAnyRoom && "hidden"}
                  `}
                  href={CREATE_ROOM_ROUTE}
                >
                  <PlusCircleIcon
                    size={40}
                    className="text-white bg-gray-700 rounded-full"
                  />
                  <p className="text-gray-700 text-sm font-bold">
                    Adicionar Anúncio
                  </p>
                </Link>
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    mode="edit"
                    handleToggleFavorites={handleToggleFavorites}
                  />
                ))}
              </div>
            )}
          </div>

          {!hasAnyRoom && !hasFilters && !isLoading && (
            <section
              className="
                flex flex-col gap-2 items-center
                mt-4 w-full rounded-[18px]
                border border-gray-300
                bg-white px-8 py-10
                shadow-[0_10px_25px_rgba(15,23,42,0.06)]
              "
            >
              <p className="text-xl font-bold text-gray-800">
                Nenhuma sala cadastrada ainda
              </p>
              <p className="text-sm text-gray-500 max-w-130 text-center">
                Parece que você ainda não adicionou nenhum anúncio em nossa
                plataforma, assim que você criar elas serão exibidas aqui!
              </p>
              <Link
                href={CREATE_ROOM_ROUTE}
                className="
                  mt-2 px-6 py-2.5 rounded-full border text-sm 
                  text-primary border-primary font-semibold
                  transition hover:border-primary-hover hover:text-primary-hover
                "
              >
                Criar Anúncio
              </Link>
            </section>
          )}

          {!hasAnyRoom && hasFilters && !isLoading && (
            <div>
              <section
                className="
                  mt-4 w-full rounded-[18px]
                  border border-gray-300
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="
                    mt-2 px-6 py-2.5 rounded-full
                    bg-primary text-white text-sm font-semibold
                    transition hover:bg-primary-hover cursor-pointer
                  "
                  >
                    Limpar filtros
                  </button>
                  <Link
                    href={CREATE_ROOM_ROUTE}
                    className="
                      mt-2 px-6 py-2.5 rounded-full border text-sm 
                      text-primary border-primary font-semibold
                      transition hover:border-primary-hover hover:text-primary-hover
                    "
                  >
                    Criar Anúncio
                  </Link>
                </div>
              </section>

              <PopularRooms />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

