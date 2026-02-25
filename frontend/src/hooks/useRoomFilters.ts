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

  return { orderByOptions };
}

