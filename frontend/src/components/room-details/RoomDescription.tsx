type RoomDescriptionProps = {
  description: string;
  address: string;
  type: string;
  rules: string;
  schedule: string;
  amenities: string[];
};

export function RoomDescription({
  description,
  address,
  type,
  rules,
  schedule,
  amenities,
}: RoomDescriptionProps) {
  return (
    <div className="rounded-2xl border border-[#e7e7eb] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-[#222]">Descrição do imóvel</h2>

      <p className="mt-4 text-sm leading-relaxed text-[#555]">{description}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-[#333]">📍 Endereço</p>
          <p className="text-[#666]">{address}</p>
        </div>
        <div>
          <p className="font-semibold text-[#333]">🏢 Tipo</p>
          <p className="text-[#666]">{type}</p>
        </div>
        <div>
          <p className="font-semibold text-[#333]">🕒 Horário</p>
          <p className="text-[#666]">{schedule}</p>
        </div>
        <div>
          <p className="font-semibold text-[#333]">📋 Regras</p>
          <p className="text-[#666]">{rules}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold text-[#333] mb-3">Recursos disponíveis</p>
        <div className="flex flex-wrap gap-2">
          {amenities.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 text-xs rounded-full bg-[#f2f4fb] text-[#444]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
