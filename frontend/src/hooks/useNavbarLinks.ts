import {
  Heart,
  CirclePlus,
  MessageCircleCode,
  BriefcaseBusiness,
  Warehouse,
  BookCheckIcon,
} from "lucide-react";
import {
  CREATE_ROOM_ROUTE,
  FAVORITES_ROUTE,
  MESSAGES_ROUTE,
  MY_ANNOUNCE_ROUTE,
  RESERVATIONS_ROUTE,
  ROOMS_ROUTE,
} from "@/constants/routes";

export function useNavbarLinks() {
  const navbarLinks = [
    {
      route: FAVORITES_ROUTE,
      label: "Favoritos",
      icon: Heart,
    },
    {
      route: MESSAGES_ROUTE,
      label: "Mensagens",
      icon: MessageCircleCode,
    },
    {
      route: RESERVATIONS_ROUTE,
      label: "Reservas",
      icon: BookCheckIcon,
    },
    {
      route: ROOMS_ROUTE,
      label: "Salas",
      icon: Warehouse,
    },
    {
      route: MY_ANNOUNCE_ROUTE,
      label: "Meus Anúncios",
      icon: BriefcaseBusiness,
    },
    {
      route: CREATE_ROOM_ROUTE,
      label: "Anunciar",
      icon: CirclePlus,
    },
  ];

  return { navbarLinks };
}
