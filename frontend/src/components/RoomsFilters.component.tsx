import React from "react";

export type OrderBy = "recent" | "higherPrice" | "lowerPrice";

type RoomsFiltersProps = {
  orderBy: OrderBy;
  onChangeOrderBy: (value: OrderBy) => void;
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
};

const amenitiesOptions = ["Wi-Fi", "Garagem", "Banheiro", "Ar-condicionado"];

export function RoomsFilters({
  orderBy,
  onChangeOrderBy,
  selectedAmenities,
  onToggleAmenity,
}: RoomsFiltersProps) {
  return (
    <aside
      className="
        bg-white rounded-[18px] px-4.5 pt-5 pb-5.5
        border border-[#e7e7eb]
        shadow-[0_4px_12px_rgba(15,23,42,0.03)]
        text-[13px] text-[#333]
      "
    >
      {/* Ordenar por */}
      <div
        className="
          mt-0 pt-0 border-t-0
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">
          Ordenar por
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`
              inline-flex items-center justify-center h-9 px-4.5 rounded-full
              border text-[0.85rem] whitespace-nowrap cursor-pointer transition
              hover:border-[#d6d6dd] hover:bg-[#f5f5f9]
              hover:shadow-[0_2px_6px_rgba(15,23,42,0.05)] 
              focus:outline-none focus:ring-0 active:outline-none active:ring-0
              ${
                orderBy === "recent"
                  ? "bg-[#e53935] border-[#e53935] text-white"
                  : "bg-white border-[#e5e5e5] text-[#555]"
              }
            `}
            onClick={() => onChangeOrderBy("recent")}
          >
            Mais recente
          </button>

          <button
            type="button"
            className={`
              inline-flex items-center justify-center h-9 px-4.5 rounded-full
              border text-[0.85rem] whitespace-nowrap cursor-pointer transition
              hover:border-[#d6d6dd] hover:bg-[#f5f5f9]
              hover:shadow-[0_2px_6px_rgba(15,23,42,0.05)] 
              focus:outline-none focus:ring-0 active:outline-none active:ring-0
              ${
                orderBy === "higherPrice"
                  ? "bg-[#e53935] border-[#e53935] text-white"
                  : "bg-white border-[#e5e5e5] text-[#555]"
              }
            `}
            onClick={() => onChangeOrderBy("higherPrice")}
          >
            Maior preço
          </button>

          <button
            type="button"
            className={`
              inline-flex items-center justify-center h-9 px-4.5 rounded-full
              border text-[0.85rem] whitespace-nowrap cursor-pointer transition
              hover:border-[#d6d6dd] hover:bg-[#f5f5f9]
              hover:shadow-[0_2px_6px_rgba(15,23,42,0.05)] 
              focus:outline-none focus:ring-0 active:outline-none active:ring-0
              ${
                orderBy === "lowerPrice"
                  ? "bg-[#e53935] border-[#e53935] text-white"
                  : "bg-white border-[#e5e5e5] text-[#555]"
              }
            `}
            onClick={() => onChangeOrderBy("lowerPrice")}
          >
            Menor preço
          </button>
        </div>
      </div>

      {/* Preço */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">Preço</p>

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
          />
        </div>
      </div>

      {/* Área útil */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">
          Área útil (m²)
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
        <p className="text-[13px] font-semibold mb-2 text-[#333]">Capacidade</p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín. pessoas"
            className="
              w-full px-2.5 py-2 rounded-md border border-[#e5e5e5]
              text-[0.85rem] bg-[#fcfcff]
              placeholder:text-[#b0b0bd] placeholder:text-[0.8rem]
              focus:outline-none focus:border-[#e53935]
              focus:ring-1 focus:ring-[#e53935]/40
            "
          />
        </div>
      </div>

      {/* Recursos */}
      <div
        className="
          mt-4 pt-3 border-t border-[#f1f1f4]
          first:mt-0 first:pt-0 first:border-t-0
        "
      >
        <p className="text-[13px] font-semibold mb-2 text-[#333]">Recursos</p>

        <div className="flex flex-wrap gap-2">
          {amenitiesOptions.map((amenity) => {
            const selected = selectedAmenities.includes(amenity);

            return (
              <button
                key={amenity}
                type="button"
                onClick={() => onToggleAmenity(amenity)}
                className={`
                  inline-flex items-center justify-center h-9 px-[18px]
                  rounded-full border text-[0.85rem] whitespace-nowrap
                  transition cursor-pointer
                  focus:outline-none focus:ring-0 active:outline-none active:ring-0
                  ${
                    selected
                      ? "bg-[#ffe4e0] border-[#e53935] text-[#e53935] shadow-[0_0_0_1px_rgba(229,57,53,0.06)]"
                      : "bg-white border-[#e5e5e5] text-[#555] hover:border-[#d6d6dd] hover:bg-[#f5f5f9]"
                  }
                `}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

