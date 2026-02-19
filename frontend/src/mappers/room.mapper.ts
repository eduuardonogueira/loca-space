import type { IRoomWithAmenities } from "@/types/room";
import type { Room } from "@/components";

export function mapApiRoomToCardRoom(apiRoom: IRoomWithAmenities): Room {
  const city = apiRoom.address?.city ?? "";
  const state = apiRoom.address?.state ?? "";
  const location = [city, state].filter(Boolean).join(" - ");

  const fullAddress = apiRoom.address 
    ? `${apiRoom.address.street}, ${apiRoom.address.number} - ${apiRoom.address.bairro}`
    : "";

  return {
    id: apiRoom.id,
    title: apiRoom.name,
    location: location || "-",
    price: apiRoom.price ?? 0,
    imageUrl: apiRoom.imageUrl && apiRoom.imageUrl !== "https://imagem.com/sala.jpg" 
  ? apiRoom.imageUrl 
  : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    area: apiRoom.size ?? 0,
    capacity: apiRoom.totalSpace ?? 0,
    amenities: (apiRoom.amenities ?? []).map((a) => a.name),
    description: apiRoom.description || "",
    type: apiRoom.type || "room",
    address: fullAddress, 
    rules: [],   
    schedule: [] 
  } as unknown as Room; 
}