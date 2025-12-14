import {
  Heart,
  CirclePlus,
  MessageCircleCode,
  BriefcaseBusiness,
} from "lucide-react";
import {
  ANNOUNCE_ROUTE,
  FAVORITES_ROUTE,
  MESSAGES_ROUTE,
  MY_ANNOUNCE_ROUTE,
} from "@/constants/routes";

export function useNavbarLinks() {
  const navbarLinks = [
    {
      route: ANNOUNCE_ROUTE,
      label: "Anunciar",
      icon: CirclePlus,
    },
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
      route: MY_ANNOUNCE_ROUTE,
      label: "Meus Anúncios",
      icon: BriefcaseBusiness,
    },
  ];

  return { navbarLinks };
}

