import { EnumRoomStatus, EnumRoomType } from "@/types/room";

export default function useRoomFilters() {
  const orderByOptions = [
    {
      label: "Mais recente",
      value: "data-recente",
    },
    {
      label: "Mais Antigo",
      value: "data-antiga",
    },
    {
      label: "Maior preço",
      value: "maior-preço",
    },
    {
      label: "Menor preço",
      value: "menor-preço",
    },
  ];

  const roomStatusOptions = [
    { label: "Disponível", value: EnumRoomStatus.AVAILABLE },
    { label: "Indisponível", value: EnumRoomStatus.UNAVAILABLE },
    { label: "Agendada", value: EnumRoomStatus.OCCUPIED },
    { label: "Em manutenção", value: EnumRoomStatus.MAINTENANCE },
  ];

  const roomTypeOptions = [
    { label: "Reunião", value: EnumRoomType.SalaReuniao },
    { label: "Escritório", value: EnumRoomType.Escritorio },
    { label: "Gerais", value: EnumRoomType.Gerais },
  ];

  return { orderByOptions, roomStatusOptions, roomTypeOptions };
}

