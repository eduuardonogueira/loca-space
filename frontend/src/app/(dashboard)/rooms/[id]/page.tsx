import { RoomDetailsView } from "./RoomDetailsView";

export default function RoomDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <RoomDetailsView roomId={params.id} />;
}
