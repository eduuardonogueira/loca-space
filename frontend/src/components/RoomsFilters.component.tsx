"use client";

import { useAmenities } from "@/hooks/useAmenities";
import useRoomFilters from "@/hooks/useRoomFilters";
import { IFilterRange } from "@/hooks/useRoomWithFilters";
import React, { Dispatch, SetStateAction } from "react";

interface IRoomsFiltersProps {
  orderBy: string | null;
  amenitieIds: number[];
  price: IFilterRange;
  size: IFilterRange;
  totalSpace: IFilterRange;
  setOrderBy: Dispatch<SetStateAction<string | null>>;
  setPrice: Dispatch<SetStateAction<IFilterRange>>;
  setSize: Dispatch<SetStateAction<IFilterRange>>;
  setTotalSpace: Dispatch<SetStateAction<IFilterRange>>;
  setAmenitieIds: Dispatch<SetStateAction<number[]>>;
}

export function RoomsFilters({
  orderBy,
  amenitieIds,
  price,
  size,
  totalSpace,
  setOrderBy,
  setPrice,
  setSize,
  setTotalSpace,
  setAmenitieIds,
}: IRoomsFiltersProps) {
  const { orderByOptions } = useRoomFilters();
  const { amenities } = useAmenities();

  return (
    <aside
      className="
        bg-white rounded-[18px] px-4.5 pt-5 pb-5.5
        border border-[#e7e7eb]
        shadow-[0_4px_12px_rgba(15,23,42,0.03)]
        text-[13px] text-[#333] h-min
      "
    >
      {/* OrderBy */}
      <div
        className="
          mt-0 pt-0 border-t-0
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">
          Ordenar por:
        </p>

        <div className="flex flex-wrap gap-2">
          {orderByOptions.map((order) => (
            <button
              key={order.label}
              type="button"
              className={`
              inline-flex items-center justify-center h-9 px-4.5 rounded-full
              border text-[0.85rem] whitespace-nowrap cursor-pointer transition
              hover:border-[#d6d6dd] hover:bg-[#f5f5f9]
              hover:shadow-[0_2px_6px_rgba(15,23,42,0.05)] 
              focus:outline-none focus:ring-0 active:outline-none active:ring-0
              ${
                orderBy === order.value
                  ? "bg-[#e53935] border-[#e53935] text-white"
                  : "bg-white border-[#e5e5e5] text-[#555]"
              }
            `}
              onClick={() =>
                setOrderBy(order.value === orderBy ? null : order.value)
              }
            >
              {order.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">Preço:</p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={price.min ? price.min.toString() : ""}
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, min: Number(e.target.value) }))
            }
          />
          <span className="text-[12px] text-[#777]">–</span>
          <input
            type="number"
            placeholder="Máx."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={price.max ? price.max.toString() : ""}
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, max: Number(e.target.value) }))
            }
          />
        </div>
      </div>

      {/* Área */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">
          Área útil (m²):
        </p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={size.min ? size.min.toString() : ""}
            onChange={(e) =>
              setSize((prev) => ({ ...prev, min: Number(e.target.value) }))
            }
          />
          <span className="text-[12px] text-[#777]">–</span>
          <input
            type="number"
            placeholder="Máx."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={size.max ? size.max.toString() : ""}
            onChange={(e) =>
              setSize((prev) => ({ ...prev, max: Number(e.target.value) }))
            }
          />
        </div>
      </div>

      {/* Capacidade */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">
          Capacidade (Pessoas):
        </p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={totalSpace.min?.toString()}
            onChange={(e) =>
              setTotalSpace((prev) => ({
                ...prev,
                min: Number(e.target.value),
              }))
            }
          />
          <span className="text-[12px] text-[#777]">–</span>
          <input
            type="number"
            placeholder="Máx."
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
            value={totalSpace.max ? totalSpace.max.toString() : ""}
            onChange={(e) =>
              setTotalSpace((prev) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      {/* Amenities */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">Recursos:</p>

        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => {
            const isSelected = amenitieIds.includes(amenity.id);

            function handleToggleAmenity() {
              if (isSelected) {
                setAmenitieIds((prev) =>
                  prev.filter((id) => id !== amenity.id),
                );
              } else {
                setAmenitieIds((prev) => [...prev, amenity.id]);
              }
            }

            return (
              <button
                key={amenity.id}
                type="button"
                onClick={handleToggleAmenity}
                className={`
                  inline-flex items-center justify-center h-9 px-4.5
                  rounded-full border text-[0.85rem] whitespace-nowrap
                  transition cursor-pointer
                  focus:outline-none focus:ring-0 active:outline-none active:ring-0
                  ${
                    isSelected
                      ? "bg-[#ffe4e0] border-[#e53935] text-[#e53935] shadow-[0_0_0_1px_rgba(229,57,53,0.06)]"
                      : "bg-white border-[#e5e5e5] text-[#555] hover:border-[#d6d6dd] hover:bg-[#f5f5f9]"
                  }
                `}
              >
                {amenity.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

