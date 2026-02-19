import { ROOM_ROUTE, ROOMS_ROUTE } from "@/constants/routes";
import { IRoom } from "@/types/room";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface IProfileRoomCardProps {
  room: IRoom;
}

export function ProfileRoomCard({ room }: IProfileRoomCardProps) {
  return (
    <Link
      href={ROOM_ROUTE.replace("[id]", room.id.toString())}
      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <img
        src={room.imageUrl}
        alt={room.name}
        className="w-24 h-20 rounded-lg object-cover bg-gray-200"
      />

      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-sm mb-1">{room.name}</h3>
        <p className="text-gray-500 text-xs">A partir de</p>
        <p className="font-bold text-gray-900">
          {room.price}{" "}
          <span className="text-xs font-normal text-gray-400">/ hora</span>
        </p>
      </div>

      <div className="text-gray-300 group-hover:text-red-500 transition-colors">
        <ChevronRight size={24} />
      </div>
    </Link>
  );
}

