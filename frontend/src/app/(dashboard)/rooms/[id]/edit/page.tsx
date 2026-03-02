import { getRoomById } from "@/services/room";
import { EditRoomWizard } from "@/components";
import { notFound } from "next/navigation";
import { getAmenities } from "@/services";
import Link from "next/link";
import { AVAILABILITY_ROUTE } from "@/constants/routes";

export const metadata = {
  title: "Editar Espaco",
  description: "Edite as informacoes do seu espaco",
};

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roomId = Number(id);

  if (isNaN(roomId)) {
    notFound();
  }

  const [room, amenities] = await Promise.all([
    getRoomById(roomId),
    getAmenities(),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="flex w-full justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Editar Anúncio
            </h1>
            <p className="mt-2 text-muted-foreground">
              Atualize as informações da sala.
            </p>
          </div>
          <div>
            <Link
              href={AVAILABILITY_ROUTE.replace("[id]", room.id)}
              className="p-4 border border-red-600 bg-primary text-white rounded-md hover:bg-primary-hover text-sm"
            >
              Editar Disponibilidade
            </Link>
          </div>
        </section>
        <EditRoomWizard room={room} amenities={amenities ?? []} />
      </div>
    </main>
  );
}

