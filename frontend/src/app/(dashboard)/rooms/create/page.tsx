import { getAmenities } from "@/api/amenity";
import { CreateRoomWizard } from "@/components/CreateRoomWizard.component";

export const metadata = {
  title: "Criar Espaco",
  description: "Cadastre um novo espaco para locacao",
};

export default async function CreateRoomPage() {
  const amenities = await getAmenities();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-x4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-red-500">
            Criar novo espaco
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha as informacoes abaixo para cadastrar seu espaco.
          </p>
        </div>
        <CreateRoomWizard amenities={amenities ?? []} />
      </div>
    </main>
  );
}

