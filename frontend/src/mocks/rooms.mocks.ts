import type { Room } from "@/components";

export const allRooms: Room[] = [
  {
    id: 1,
    title: "Sala de Reunião - Prédio Executivo",
    location: "Belém - PA",
    price: 1000,
    imageUrl:
      "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg",
    area: 22,
    capacity: 8,
    amenities: ["Wi-Fi", "Projetor", "Climatizada"],

    description:
      "Sala ideal para reuniões corporativas, equipada com projetor HD, Wi-Fi de alta velocidade e mesa executiva para até 8 pessoas. Ambiente silencioso e confortável para apresentações e alinhamentos.",
    address: "Av. Nazaré, 1500 - Belém, PA",
    type: "Sala de reunião corporativa",
    rules: "Proibido fumar • Não permitido eventos festivos",
    schedule: "08:00 às 20:00",
  },
  {
    id: 2,
    title: "Sala Industrial - Condomínio",
    location: "Ananindeua - PA",
    price: 850,
    imageUrl:
      "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg",
    area: 32,
    capacity: 12,
    amenities: ["Wi-Fi", "Garagem"],

    description:
      "Espaço industrial amplo e versátil, ideal para treinamentos técnicos, workshops e pequenas produções. Boa ventilação e acesso facilitado para carga e descarga.",
    address: "Rod. BR-316, Km 8 - Ananindeua, PA",
    type: "Sala industrial multiuso",
    rules: "Permitido equipamentos • Sem uso residencial",
    schedule: "07:00 às 18:00",
  },
  {
    id: 3,
    title: "Sala de Treinamento - Coworking",
    location: "Belém - PA",
    price: 950,
    imageUrl:
      "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg",
    area: 28,
    capacity: 15,
    amenities: ["Wi-Fi", "Ar-condicionado"],

    description:
      'Sala moderna para treinamentos, com cadeiras ergonômicas, TV 60", quadro branco e ótima iluminação. Ideal para turmas e capacitações em grupo.',
    address: "Tv. 14 de Março, 890 - Belém, PA",
    type: "Sala de treinamento",
    rules: "Sem alimentos pesados • Respeitar horário contratado",
    schedule: "09:00 às 21:00",
  },
];
