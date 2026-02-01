import React from "react";

export type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  area: number; // m²
  capacity: number;
  amenities: string[];
};

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="ls-card">
      <div className="ls-card-image-wrapper">
        <img
          src={room.imageUrl}
          alt={room.title}
          className="ls-card-image"
        />
        <button className="ls-card-favorite" aria-label="Favoritar">
          ♡
        </button>
      </div>

      <div className="ls-card-body">
        <h2 className="ls-card-title">{room.title}</h2>
        <p className="ls-card-location">{room.location}</p>

        <p className="ls-card-price">
          R{"$ "}
          {room.price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>

        <div className="ls-card-details-row">
          <span>{room.area} m²</span>
          <span>{room.capacity} pessoas</span>
        </div>

        <div className="ls-card-amenities">
          {room.amenities.map((a) => (
            <span key={a} className="ls-card-amenity-pill">
              {a}
            </span>
          ))}
        </div>

        <div className="ls-card-actions">
          <button className="ls-card-button ls-card-button--secondary">
            Enviar mensagem
          </button>
          <button className="ls-card-button ls-card-button--primary">
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
