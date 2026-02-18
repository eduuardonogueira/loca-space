"use client";

import {
  createAvailability,
  deleteAvailability,
  updateAvailability,
} from "@/api";
import { ICreateAvailability } from "@/types/availability";
import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect } from "react";

type IAvailabilityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "delete";
  selectedAvailability?: ICreateAvailability;
  availabilityId: number;
  roomId: number;
};

export function AvailabilityModal({
  isOpen,
  onClose,
  mode,
  selectedAvailability,
  availabilityId,
  roomId,
}: IAvailabilityModalProps) {
  const DEFAULT_AVAILABILITY: ICreateAvailability = {
    weekday: 1,
    startTime: "08:00",
    endTime: "12:00",
    roomId,
  };

  useEffect(() => {
    if (selectedAvailability) {
      setAvailability(selectedAvailability);
    } else {
      setAvailability(DEFAULT_AVAILABILITY);
    }
  }, [selectedAvailability, roomId]);

  const [availability, setAvailability] = useState<ICreateAvailability>(
    selectedAvailability || DEFAULT_AVAILABILITY,
  );

  const handleUpdateOrCreateAvailability = async () => {
    try {
      const payload = {
        ...availability,
        roomId,
      };
      const result = await (mode === "add"
        ? createAvailability(payload)
        : updateAvailability(payload, availabilityId));

      if (result) {
        toast.success(
          `Disponibilidade ${
            mode === "add" ? "criada" : "atualizada"
          } com sucesso!`,
        );
      } else {
        toast.error("Erro ao salvar disponibilidade.");
      }
      onClose();
    } catch (error) {
      console.error(
        `Erro ao ${mode === "add" ? "criar" : "atualizar"} disponibilidade:`,
        error,
      );
    }
  };

  const handleDeleteAvailability = async () => {
    if (!selectedAvailability || !(selectedAvailability as any).id) {
      console.error("Nenhuma disponibilidade selecionada para excluir.");
      return;
    }

    try {
      const success = await deleteAvailability(availabilityId);

      if (success) {
        toast.success("Disponibilidade excluída com sucesso.");
      } else {
        toast.error("Erro ao excluir disponibilidade.");
      }
      onClose();
    } catch (error) {
      console.error("Erro ao deletar disponibilidade:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        {mode === "delete" ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer">
              Confirmar Exclusão
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir essa disponibilidade?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-sm text-gray-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAvailability}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {mode === "add"
                ? "Adicionar Disponibilidade"
                : "Editar Disponibilidade"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Atualize a disponibilidade da sala.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Dia da Semana:
                </label>
                <select
                  value={availability.weekday}
                  onChange={(e) =>
                    setAvailability((prev) => ({
                      ...prev,
                      weekday: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm cursor-pointer"
                >
                  {[
                    "Domingo",
                    "Segunda-feira",
                    "Terça-feira",
                    "Quarta-feira",
                    "Quinta-feira",
                    "Sexta-feira",
                    "Sábado",
                  ].map((day, index) => (
                    <option
                      key={index}
                      value={index}
                      className="cursor-pointer"
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Horário de Início:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaRegClock />
                    </span>
                    <input
                      type="time"
                      value={availability.startTime}
                      onChange={(e) =>
                        setAvailability((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-3 py-2 border rounded-md text-sm cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Horário de Fim:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaRegClock />
                    </span>
                    <input
                      type="time"
                      value={availability.endTime}
                      onChange={(e) =>
                        setAvailability((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-3 py-2 border rounded-md text-sm cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md text-sm text-gray-700 cursor-pointer hover:bg-red-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateOrCreateAvailability}
                  className="px-4 py-2 bg-red-500 border text-white rounded-md text-sm cursor-pointer hover:invert"
                >
                  {mode === "add" ? "Criar" : "Atualizar"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

