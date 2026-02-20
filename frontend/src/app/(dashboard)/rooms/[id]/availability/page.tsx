"use client";

import {
  FaRegCalendarAlt,
  FaRegClock,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaChevronDown,
  FaCalendar,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { AvailabilityModal, Loader } from "@/components";
import { IAvailability } from "@/types/availability";
import { getAvailabilityByRoom } from "@/api/availability";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getRooms } from "@/api";
import { IRoomWithAmenities } from "@/types/room";
import { AVAILABILITY_ROUTE } from "@/constants/routes";
import { formatRoomAddress } from "../../../../../utils/formatRoomAddress";

export default function Availability() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roomId = parseInt(params.id);

  const [rooms, setRooms] = useState<IRoomWithAmenities[]>();
  const [availabilities, setAvailabilities] = useState<IAvailability[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<IRoomWithAmenities>();
  const [selectedAvailability, setSelectedAvailability] =
    useState<IAvailability>();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  async function fetchAvailabilityByRooms() {
    try {
      const response = await getAvailabilityByRoom(roomId);

      if (response) {
        setAvailabilities(response);
      }
    } catch (error) {
      const message = "Erro ao buscar disponibilidade";
      toast.error(message);
      console.error(message, error);
    }
  }

  async function fetchRooms() {
    try {
      const response = await getRooms();

      if (response) {
        setRooms(response);
        const selectedRoom = response.find((room) => room.id === roomId);
        setSelectedRoom(selectedRoom);
      }
    } catch (error) {
      const message = "Erro ao buscar disponibilidade";
      toast.error(message);
      console.error(message, error);
    }
  }

  useEffect(() => {
    fetchAvailabilityByRooms();
  }, [roomId, isModalOpen]);

  useEffect(() => {
    fetchRooms();
  }, [isDropdownOpen]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleRoomSelect = (room: IRoomWithAmenities) => {
    setSelectedRoom(room);
    setIsDropdownOpen(false);
    router.push(`${AVAILABILITY_ROUTE}/${room.id}`);
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedAvailability(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (availability: IAvailability) => {
    setModalMode("edit");
    setSelectedAvailability(availability);
    setIsModalOpen(true);
  };

  const openDeleteModal = (availability: IAvailability) => {
    setSelectedAvailability(availability);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleOnCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAvailability(undefined);
  };

  // Função para traduzir número do dia da semana
  const getWeekdayName = (dayNumber: number) => {
    const weekdays = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return weekdays[dayNumber] ?? "Dia inválido";
  };

  const groupedAvailabilities = availabilities.reduce<
    Record<number, IAvailability[]>
  >((acc, availability) => {
    if (!acc[availability.weekday]) {
      acc[availability.weekday] = [];
    }
    acc[availability.weekday].push(availability);
    return acc;
  }, {});

  if (!selectedRoom) {
    return <Loader text="Carregando disponibilidade..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="p-10 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaRegCalendarAlt className="text-3xl text-black" />
            <h1 className="text-2xl font-bold text-gray-800">
              Disponibilidade
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-fit min-w-70">
              <div
                className="flex items-center justify-between border border-gray-300 rounded-md cursor-pointer px-4 py-2"
                onClick={toggleDropdown}
              >
                <span className="font-bold text-sm text-gray-900">
                  {selectedRoom.name}
                </span>
                <div className="flex items-center ml-3 px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm font-medium">
                  <FaMapMarkerAlt className="mr-1" />
                  {formatRoomAddress(selectedRoom.address)}
                </div>
                <FaChevronDown className="ml-3 text-gray-500 text-xs" />
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                  {rooms?.map((room, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRoomSelect(room)}
                    >
                      <span className="text-sm font-semibold text-gray-800">
                        {room.name}
                      </span>
                      <span className="block text-xs text-gray-600">
                        {formatRoomAddress(selectedRoom.address)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              id="add-btn"
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 text-sm cursor-pointer"
              onClick={openAddModal}
            >
              Adicionar
            </button>
          </div>
        </div>

        {availabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 w-full border rounded-lg border-gray-300">
            <FaRegCalendarAlt className="text-5xl text-gray-400 mb-4" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Sem Disponibilidade Atualmente
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Você não criou nenhuma disponibilidade para essa sala no momento
            </p>
            <button
              onClick={() => document.getElementById("add-btn")?.click()}
              className="px-6 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-800 cursor-pointer"
            >
              Criar agora!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupedAvailabilities)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([weekday, items]) => (
                <div
                  key={getWeekdayName(parseInt(weekday))}
                  className="bg-white p-5 rounded-xl h-fit shadow-md border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    {getWeekdayName(parseInt(weekday))}
                    <h2 className="text-lg font-semibold text-gray-700 mb-3"></h2>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {items.map((availability, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg"
                      >
                        <span className="flex items-center gap-2 text-gray-800 text-sm font-medium">
                          <FaRegClock />
                          {availability.startTime.slice(0, -3)} -{" "}
                          {availability.endTime.slice(0, -3)}
                        </span>
                        <div className="flex items-center gap-4">
                          <button
                            className="text-gray-500 hover:text-blue-500 cursor-pointer"
                            onClick={() => openEditModal(availability)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                            onClick={() => openDeleteModal(availability)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={handleOnCloseModal}
        mode={modalMode}
        availabilityId={selectedAvailability?.id || 0}
        selectedAvailability={selectedAvailability}
        roomId={roomId}
      />
    </div>
  );
}

