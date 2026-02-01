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
    <aside className="ls-sidebar">
      {/* ORDENAR POR */}
      <div className="ls-sidebar-section">
        <p className="ls-sidebar-title">Ordenar por</p>

        {/* grid 2x2 para ficar igual à referência */}
        <div className="ls-pill-group ls-pill-group--grid-2">
          <button
            type="button"
            className={
              "ls-pill-button" +
              (orderBy === "recent" ? " ls-pill-button--active" : "")
            }
            onClick={() => onChangeOrderBy("recent")}
          >
            Mais recente
          </button>

          <button
            type="button"
            className={
              "ls-pill-button" +
              (orderBy === "higherPrice" ? " ls-pill-button--active" : "")
            }
            onClick={() => onChangeOrderBy("higherPrice")}
          >
            Maior preço
          </button>

          <button
            type="button"
            className={
              "ls-pill-button" +
              (orderBy === "lowerPrice" ? " ls-pill-button--active" : "")
            }
            onClick={() => onChangeOrderBy("lowerPrice")}
          >
            Menor preço
          </button>

          {/* Se quiser um 4º botão “Mais relevantes” depois,
              é só criar outro aqui e ajustar o type OrderBy */}
        </div>
      </div>

      {/* PREÇO */}
      <div className="ls-sidebar-section">
        <p className="ls-sidebar-title">Preço</p>
        <div className="ls-range-row">
          <input
            type="number"
            className="ls-input"
            placeholder="Mín."
            min={0}
          />
          <span className="ls-range-separator">–</span>
          <input
            type="number"
            className="ls-input"
            placeholder="Máx."
            min={0}
          />
        </div>
      </div>

      {/* ÁREA ÚTIL */}
      <div className="ls-sidebar-section">
        <p className="ls-sidebar-title">Área útil (m²)</p>
        <div className="ls-range-row">
          <input
            type="number"
            className="ls-input"
            placeholder="Mín."
            min={0}
          />
          <span className="ls-range-separator">–</span>
          <input
            type="number"
            className="ls-input"
            placeholder="Máx."
            min={0}
          />
        </div>
      </div>

      {/* CAPACIDADE */}
      <div className="ls-sidebar-section">
        <p className="ls-sidebar-title">Capacidade</p>
        <div className="ls-range-row">
          <input
            type="number"
            className="ls-input"
            placeholder="Min. pessoas"
            min={0}
          />
        </div>
      </div>

      {/* RECURSOS */}
      <div className="ls-sidebar-section">
        <p className="ls-sidebar-title">Recursos</p>
        <div className="ls-pill-group ls-pill-group--wrap">
          {amenitiesOptions.map((amenity) => (
            <button
              key={amenity}
              type="button"
              className={
                "ls-pill-button ls-pill-button--outline" +
                (selectedAmenities.includes(amenity)
                  ? " ls-pill-button--outline-active"
                  : "")
              }
              onClick={() => onToggleAmenity(amenity)}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
