import { ChevronRight } from "lucide-react";

interface RoomCardProps {
  title: string;
  price: string;
  image: string;
}

export function RoomCard({ title, price, image }: RoomCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Foto da Sala */}
      <img
        src={image}
        alt={title}
        className="w-24 h-20 rounded-lg object-cover bg-gray-200"
      />

      {/* Informações */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
        <p className="text-gray-500 text-xs">A partir de</p>
        <p className="font-bold text-gray-900">
          {price}{" "}
          <span className="text-xs font-normal text-gray-400">/ hora</span>
        </p>
      </div>

      {/* Setinha (só aparece colorida quando passa o mouse) */}
      <div className="text-gray-300 group-hover:text-red-500 transition-colors">
        <ChevronRight size={24} />
      </div>
    </div>
  );
}
