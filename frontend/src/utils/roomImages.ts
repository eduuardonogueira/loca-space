import { IRoom } from "@/types/room";

const PLACEHOLDER_ROOM_IMAGE =
  "https://placehold.co/1200x800/f4f4f6/9ca3af?text=Sala";

function normalizeImageValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean);
      }
    } catch {
      // segue parsing textual
    }
  }

  return trimmed
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getRoomImageList(imageUrl?: string | null): string[] {
  if (!imageUrl) return [];
  return normalizeImageValue(imageUrl);
}

export function getRoomPrimaryImage(room: Pick<IRoom, "imageUrl">): string {
  const images = getRoomImageList(room.imageUrl);
  return images[0] ?? PLACEHOLDER_ROOM_IMAGE;
}

export function getRoomPlaceholderImage(): string {
  return PLACEHOLDER_ROOM_IMAGE;
}
