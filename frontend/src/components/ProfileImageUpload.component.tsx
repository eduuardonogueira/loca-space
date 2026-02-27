"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Upload } from "lucide-react";

interface ProfileImageUploadProps {
  avatarUrl?: string | null; 
  file: File | null; 
  onChange: (file: File | null) => void;
  size?: number;
}

export function ProfileImageUpload({
  avatarUrl,
  file,
  onChange,
  size = 140,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);

  useEffect(() => {
    if (!file) {
      setPreview(avatarUrl || null);
    }
  }, [avatarUrl, file]);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleFile = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || !incoming[0]) return;

      const selected = incoming[0];

      if (!selected.type.startsWith("image/")) return;

      onChange(selected);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative overflow-hidden rounded-full border bg-muted transition-all hover:scale-[1.02]"
        style={{ width: size, height: size }}
      >
        {/* Imagem ou Placeholder */}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Upload className="h-8 w-8" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
          <span className="text-sm font-medium">Alterar Foto</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
        />
      </button>
    </div>
  );
}