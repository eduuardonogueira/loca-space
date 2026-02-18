"use client";

import { useState } from "react";
import {
  Calendar,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { ProfileCard, ProfileRoomCard } from "@/components";
import { EditProfileModal } from "../../../components/EditProfileModal.component";
import { IRoomWithAmenities } from "@/types/room";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const rooms: IRoomWithAmenities[] = [
    {
      id: 1,
      title: "Sala de Reunião - Executivo",
      price: 800,
      location: "Belém, Umarizal",
      imageUrl:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300",
      amenities: [
        { id: 1, name: "Wi-Fi" },
        { id: 2, name: "Ar condicionado" },
        { id: 3, name: "TV" },
      ],
    },
    {
      id: 2,
      title: "Sala Industrial - Prédio A",
      price: 800,
      location: "Belém, Umarizal",
      imageUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=300",
      amenities: [
        { id: 4, name: "Quadro Branco" },
        { id: 5, name: "Café" },
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 min-h-screen relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: Perfil Fixo */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-8 h-full">
          <ProfileCard
            type="page"
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* COLUNA DIREITA: Conteúdo */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-10">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Histórico</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <ProfileRoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Favoritos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <ProfileRoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Estatísticas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-red-100 rounded-bl-2xl text-red-500">
                  <Calendar size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Total Reservas Feitas
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-red-100 rounded-bl-2xl text-red-500">
                  <Clock size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Dias de Uso
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">23</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-yellow-100 rounded-bl-2xl text-yellow-500">
                  <Star size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Avaliação Média
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">4,8/5</p>
              </div>
              <div className="bg-gray-600 p-5 rounded-2xl shadow-sm border border-gray-500 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-3 bg-gray-500 rounded-bl-2xl text-gray-300">
                  <CheckCircle size={20} />
                </div>
                <p className="text-xs text-gray-300 font-medium mt-2">
                  Total Reservas Alugadas
                </p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
              <div className="bg-gray-600 p-5 rounded-2xl shadow-sm border border-gray-500 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-3 bg-gray-500 rounded-bl-2xl text-gray-300">
                  <DollarSign size={20} />
                </div>
                <p className="text-xs text-gray-300 font-medium mt-2">
                  Valor Total Ganho
                </p>
                <p className="text-2xl font-bold mt-1">R$ 300</p>
              </div>
              <div className="bg-gray-600 p-5 rounded-2xl shadow-sm border border-gray-500 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-3 bg-gray-500 rounded-bl-2xl text-gray-300">
                  <TrendingUp size={20} />
                </div>
                <p className="text-xs text-gray-300 font-medium mt-2">
                  Horas Alugadas
                </p>
                <p className="text-2xl font-bold mt-1">12</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

