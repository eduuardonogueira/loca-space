"use client";

import { useMemo, useState } from "react";

type RoomGalleryProps = {
  images?: string[];
};

export function RoomGallery({ images }: RoomGalleryProps) {
  const fallbackImages = useMemo(
    () => [
      "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
    []
  );

  const list = images?.length ? images.slice(0, 3) : fallbackImages;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      <div className="relative">
        <img
          src={list[activeIndex]}
          alt="Sala"
          className="h-[420px] w-full rounded-2xl object-cover"
        />

        <button
          type="button"
          aria-label="Favoritar"
          className="
            absolute right-4 top-4
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white/95
            shadow-[0_8px_18px_rgba(15,23,42,0.12)]
            text-[#333]
            transition hover:scale-105 active:scale-95
          "
        >
          ❤
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {list.map((src, i) => {
          const active = i === activeIndex;

          return (
            <button
              key={src}
              type="button"
              aria-label={`Selecionar imagem ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`
                overflow-hidden rounded-xl ring-2 transition
                ${active ? "ring-[#e53935]" : "ring-transparent hover:ring-[#e53935]/30"}
                active:translate-y-[1px]
              `}
            >
              <img
                src={src}
                alt="Miniatura"
                className={`h-24 w-full object-cover transition ${active ? "" : "hover:opacity-90"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
