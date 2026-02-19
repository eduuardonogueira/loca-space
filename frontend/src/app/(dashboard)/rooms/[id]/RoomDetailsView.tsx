"use client";

import { Loader } from "@/components";
import {
  RoomBookingCard,
  RoomDescription,
  RoomGallery,
} from "@/components/room-details";
import { useRoomDetails } from "@/hooks/useRoomDetails";

type RoomDetailsViewProps = {
  roomId: string;
};

export function RoomDetailsView({ roomId }: RoomDetailsViewProps) {
  const { roomDetails, isLoading } = useRoomDetails(parseInt(roomId));

  if (isLoading) return <Loader text="Carregando informações da sala..." />;

  if (!roomDetails) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6]">
        <div className="mx-auto w-full max-w-300 px-6 py-8">
          <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
            <p className="text-[16px] font-semibold text-[#222]">
              Sala não encontrada
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Verifique se o link está correto ou volte para a listagem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6]">
      <div className="mx-auto w-full max-w-300 px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-[#222]">{roomDetails.room.name}</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="flex flex-col gap-6">
            <RoomGallery images={["galleryImages"]} />

            <RoomDescription roomDetails={roomDetails} />
          </section>

          <aside className="h-fit lg:sticky lg:top-6">
            <RoomBookingCard roomDetails={roomDetails} />
          </aside>
        </div>
      </div>
    </div>
  );
}

