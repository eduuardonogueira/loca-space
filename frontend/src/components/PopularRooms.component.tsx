import { RoomCard } from "./RoomCard.component";
import { useMostFavoriteRooms } from "@/hooks/useMostFavoriteRooms";

export default function PopularRooms() {
  const { rooms, handleToggleFavorites } = useMostFavoriteRooms();

  if (!rooms || rooms.length === 0) return;

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
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
    </section>
  );
}

