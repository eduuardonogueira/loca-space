export function formatRoomAddress(address?: {
  street?: string;
  number?: string;
  complement?: string | null;
  bairro?: string;
  city?: string;
  state?: string;
}) {
  if (!address) return "";

  const parts = [
    address.street && `${address.street}, ${address.number ?? ""}`,
    address.complement,
    address.bairro,
    address.city && address.state
      ? `${address.city} - ${address.state}`
      : address.city,
  ];

  return parts.filter(Boolean).join(" • ");
}

