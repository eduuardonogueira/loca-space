"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function ImageUpload({
  files,
  onFilesChange,
  maxFiles = 1,
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;

      const newFiles = Array.from(incoming).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (maxFiles === 1) {
        onFilesChange(newFiles.slice(0, 1));
      } else {
        const combined = [...files, ...newFiles].slice(0, maxFiles);
        onFilesChange(combined);
      }
    },
    [files, maxFiles, onFilesChange],
  );

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const canAddMore = files.length < maxFiles;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full",
              isDragging
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Upload className="size-6" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragging
                ? "Solte a imagem aqui"
                : "Arraste e solte ou clique para selecionar"}
            </p>
            <p className="text-xs text-muted-foreground">
              {maxFiles === 1
                ? "PNG, JPG ou WEBP"
                : `Ate ${maxFiles} imagens - PNG, JPG ou WEBP`}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
            aria-label="Selecionar imagens"
          />
        </button>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            maxFiles === 1
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
          )}
        >
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${file.lastModified}`}
              file={file}
              onRemove={() => removeFile(index)}
              isFullWidth={maxFiles === 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilePreview({
  file,
  onRemove,
  isFullWidth,
}: {
  file: File;
  onRemove: () => void;
  isFullWidth?: boolean;
}) {
  const [previewUrl] = useState(() => URL.createObjectURL(file));

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-muted",
        isFullWidth ? "aspect-[3/1]" : "aspect-square",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt={file.name}
        className="size-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/40">
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={onRemove}
          className="opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`Remover ${file.name}`}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 px-2 py-1 text-xs text-background truncate opacity-0 transition-opacity group-hover:opacity-100">
        {file.name}
      </div>
    </div>
  );
}

