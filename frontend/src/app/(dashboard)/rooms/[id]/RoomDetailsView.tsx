"use client";

import { allRooms } from "@/mocks/rooms.mocks";
import {
  RoomBookingCard,
  RoomDescription,
  RoomGallery,
} from "@/components/room-details";

type RoomDetailsViewProps = {
  roomId: string;
};

export function RoomDetailsView({ roomId }: RoomDetailsViewProps) {
  const room = allRooms.find((r) => r.id === Number(roomId));

  if (!room) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f4f4f6]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-8">
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

  // ✅ Como você ainda não tem `images` no mock, vamos usar 3 imagens simples:
  const galleryImages = [
    room.imageUrl,
    "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ];

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
              advertiser="Working Plus"
              email="workingplus@gmail.com"
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
