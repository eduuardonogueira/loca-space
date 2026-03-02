import { RoomDetailsView } from "@/components";

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoomDetailsView roomId={id} />;
}

