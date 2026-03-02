"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, X, Search, Save, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  createRoomFormSchema,
  type CreateRoomFormValues,
} from "@/lib/schemas/createRoomSchema";
import {
  EnumRoomStatus,
  EnumRoomType,
  RoomStatusLabels,
  RoomTypeLabels,
  type IAmenity,
  type IRoomWithAmenities,
} from "@/types/room";
import {
  deleteRoom,
  updateRoom,
  uploadRoomBanner,
  uploadRoomPhotos,
} from "@/services/room";
import { toast } from "react-toastify";
import { ImageUpload } from "./ImageUpload.component";
import { MY_ANNOUNCE_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";

interface EditRoomWizardProps {
  room: IRoomWithAmenities;
  amenities: IAmenity[];
}

export function EditRoomWizard({ room, amenities }: EditRoomWizardProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAmenity, setCustomAmenity] = useState("");
  const [customAmenities, setCustomAmenities] = useState<number[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  // Image states
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  // Track existing images from the room
  const [existingBanner] = useState<string | null>(room.bannerUrl);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    room.photoUrls ?? [],
  );
  const [removedBanner, setRemovedBanner] = useState(false);

  // Pre-populate the form with room data
  const existingAmenityNames = room.amenities.map((a) => a.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomFormSchema as any),
    mode: "onSubmit",
    defaultValues: {
      name: room.name,
      description: room.description,
      type: room.type as any,
      status: room.status as any,
      price: room.price,
      size: room.size,
      totalSpace: room.totalSpace,
      state: room.address?.state ?? "",
      city: room.address?.city ?? "",
      cep: "12345678",
      bairro: room.address?.bairro ?? "",
      street: room.address?.street ?? "",
      number: room.address?.number ?? "",
      complement: room.address?.complement ?? "",
      amenities: existingAmenityNames,
    },
  });

  const selectedAmenities = watch("amenities") ?? [];

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  };

  const handleDeleteRoom = async () => {
    const isDeleted = await deleteRoom(room.id);

    if (isDeleted) {
      toast.success("Sala deletada com sucesso!");
      router.push(MY_ANNOUNCE_ROUTE);
    } else {
      toast.error("Erro ao deletar sala.");
    }
  };

  const handleCepChange = async (rawValue: string) => {
    const formatted = formatCep(rawValue);
    setValue("cep", formatted);

    const digits = rawValue.replace(/\D/g, "");
    if (digits.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${digits}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          setValue("state", data.uf || "");
          setValue("city", data.localidade || "");
          setValue("bairro", data.bairro || "");
          setValue("street", data.logradouro || "");
        } else {
          toast.error("CEP nao encontrado");
        }
      } catch {
        toast.error("Erro ao buscar CEP");
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const toggleAmenity = (amenityId: number) => {
    const current = getValues("amenities");

    if (current.includes(amenityId)) {
      setValue(
        "amenities",
        current.filter((id) => id !== amenityId),
        { shouldValidate: true },
      );
    } else {
      setValue("amenities", [...current, amenityId], {
        shouldValidate: true,
      });
    }
  };

  const addCustomAmenity = () => {
    // const trimmed = customAmenity.trim();
    // if (!trimmed) return;
    // if (
    //   selectedAmenities.includes(trimmed) ||
    //   customAmenities.includes(trimmed)
    // ) {
    //   toast.error("Amenidade ja adicionada");
    //   return;
    // }
    // setCustomAmenities((prev) => [...prev, trimmed]);
    // setValue("amenities", [...selectedAmenities, trimmed], {
    //   shouldValidate: true,
    // });
    // setCustomAmenity("");
  };

  const removeAmenity = (id: number) => {
    setValue(
      "amenities",
      selectedAmenities.filter((aId) => aId !== id),
      { shouldValidate: true },
    );
    setCustomAmenities((prev) => prev.filter((id) => id !== id));
  };

  const removeExistingPhoto = async (index: number) => {
    const updatedPhotoUrls = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(updatedPhotoUrls);

    const response = await updateRoom(room.id, { photoUrls: updatedPhotoUrls });

    if (response.id) {
      toast.success("foto removida com sucesso!");
      return;
    }

    toast.error("erro ao remover foto!");
  };

  const removeBanner = async () => {
    setRemovedBanner(true);

    const response = await updateRoom(room.id, { bannerUrl: null });

    if (response.id) {
      toast.success("Banner removido com sucesso!");
      return;
    }

    toast.error("Erro ao remover banner!");
  };

  const onSubmit = useCallback(
    async (data: CreateRoomFormValues) => {
      setIsSubmitting(true);
      try {
        const payload = {
          name: data.name,
          description: data.description,
          type: data.type,
          price: data.price,
          status: data.status,
          totalSpace: data.totalSpace,
          size: data.size,
          address: {
            // cep: data.cep.replace(/\D/g, ""),
            state: data.state,
            city: data.city,
            bairro: data.bairro,
            street: data.street,
            number: data.number,
            complement: data.complement || undefined,
          },
          amenities: data.amenities,
        };

        const result = await updateRoom(room.id, payload);

        if (!result.id) {
          toast.error(result.error || "Erro ao atualizar sala");
          return;
        }

        // Upload new banner if provided
        if (bannerFile) {
          const bannerFormData = new FormData();
          bannerFormData.append("banner", bannerFile);
          const bannerResult = await uploadRoomBanner(room.id, bannerFormData);
          if (!bannerResult.success) {
            toast.error("sala atualizado, mas houve erro ao enviar o banner");
          }
        }

        // Upload new photos if provided
        if (photoFiles.length > 0) {
          const photosFormData = new FormData();
          photoFiles.forEach((file) => {
            photosFormData.append("photos", file);
          });
          const photosResult = await uploadRoomPhotos(room.id, photosFormData);
          if (!photosResult.success) {
            toast.error("sala atualizado, mas houve erro ao enviar as fotos");
          }
        }

        toast.success("sala atualizado com sucesso!");
      } catch {
        toast.error("Ocorreu um erro inesperado");
      } finally {
        setIsSubmitting(false);
      }
    },
    [bannerFile, photoFiles, room.id],
  );

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          const messages = Object.values(errors)
            .map((error) => error?.message)
            .filter(Boolean)
            .join("\n");

          toast.error(messages);
        })}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Imagens */}
          <Card className="lg:col-span-1 h-max">
            <CardContent className="flex flex-col gap-6 ">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Imagens da sala
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie as imagens da sua sala. Voce pode manter as
                  existentes ou substituir por novas.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Banner section */}
                <div className="flex flex-col gap-2">
                  <Label>Banner</Label>
                  <p className="text-xs text-muted-foreground">
                    Imagem principal da sala. Recomendado: 1200x400px.
                  </p>

                  {/* Existing banner */}
                  {existingBanner && !removedBanner && !bannerFile && (
                    <div className="flex flex-col gap-2">
                      <div className="group relative aspect-3/1 overflow-hidden rounded-lg border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={existingBanner}
                          alt="Banner atual do sala"
                          className="size-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/40">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeBanner}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="mr-1 size-4" />
                            Remover
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Banner atual. Clique em remover para substituir.
                      </p>
                    </div>
                  )}

                  {/* Upload new banner */}
                  {(removedBanner || !existingBanner) && (
                    <ImageUpload
                      files={bannerFile ? [bannerFile] : []}
                      onFilesChange={(files) => setBannerFile(files[0] ?? null)}
                      maxFiles={1}
                      accept="image/*"
                    />
                  )}
                </div>

                <Separator />

                {/* Photos section */}
                <div className="flex flex-col gap-2">
                  <Label>Fotos da sala</Label>
                  <p className="text-xs text-muted-foreground">
                    Fotos existentes e novas. Adicione ate 10 fotos no total.
                  </p>

                  {/* Existing photos grid */}
                  {existingPhotos.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Fotos atuais ({existingPhotos.length})
                      </span>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {existingPhotos.map((url, index) => (
                          <div
                            key={url}
                            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Foto ${index + 1} do sala`}
                              className="size-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/40">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeExistingPhoto(index)}
                                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label={`Remover foto ${index + 1}`}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload new photos */}
                  <div className="flex flex-col gap-2">
                    {(existingPhotos.length > 0 || photoFiles.length > 0) && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Adicionar novas fotos
                      </span>
                    )}
                    <ImageUpload
                      files={photoFiles}
                      onFilesChange={setPhotoFiles}
                      maxFiles={Math.max(1, 10 - existingPhotos.length)}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col lg:col-span-2 gap-4">
            {/* Informações da sala */}
            <Card className="h-max">
              <CardContent className="flex flex-col gap-6 ">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Informações do Espaço
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Atualize os dados basicos do seu sala.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleDeleteRoom}
                    className="p-4 border border-red-600 bg-primary text-white rounded-md hover:bg-primary-hover"
                  >
                    <Trash />
                    Apagar sala
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nome do sala</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Sala de Conferencias Premium"
                      {...register("name")}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descricao</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o sala, suas caracteristicas e diferenciais..."
                      rows={4}
                      {...register("description")}
                      aria-invalid={!!errors.description}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="type">Tipo de sala</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("type", value as EnumRoomType, {
                            shouldValidate: true,
                          })
                        }
                        value={watch("type")}
                      >
                        <SelectTrigger className="w-full" id="type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(EnumRoomType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {RoomTypeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-destructive">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="type">Status da sala</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("status", value as EnumRoomStatus, {
                            shouldValidate: true,
                          })
                        }
                        value={watch("status")}
                      >
                        <SelectTrigger className="w-full" id="status">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(EnumRoomStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {RoomStatusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-sm text-destructive">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          R$
                        </span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          className="pl-10"
                          {...register("price")}
                          aria-invalid={!!errors.price}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-destructive">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="totalSpace">Capacidade (pessoas)</Label>
                      <Input
                        id="totalSpace"
                        type="number"
                        min="1"
                        placeholder="Ex: 10"
                        {...register("totalSpace")}
                        aria-invalid={!!errors.totalSpace}
                      />
                      {errors.totalSpace && (
                        <p className="text-sm text-destructive">
                          {errors.totalSpace.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="size">Tamanho da sala (m²)</Label>
                    <div className="relative">
                      <Input
                        id="size"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        className="pl-10"
                        {...register("size")}
                        aria-invalid={!!errors.size}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 xt-sm text-muted-foreground">
                        m²
                      </span>
                    </div>
                    {errors.size && (
                      <p className="text-sm text-destructive">
                        {errors.size.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="h-max">
              <CardContent className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Endereco do sala
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Atualize o endereco do sala. O CEP preenchera
                    automaticamente os demais campos.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cep">CEP</Label>
                    <div className="relative">
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={watch("cep")}
                        onChange={(e) => handleCepChange(e.target.value)}
                        aria-invalid={!!errors.cep}
                      />
                      {isFetchingCep && (
                        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-pulse text-muted-foreground" />
                      )}
                    </div>
                    {errors.cep && (
                      <p className="text-sm text-destructive">
                        {errors.cep.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="UF"
                        {...register("state")}
                        aria-invalid={!!errors.state}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        {...register("city")}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      placeholder="Bairro"
                      {...register("bairro")}
                      aria-invalid={!!errors.bairro}
                    />
                    {errors.bairro && (
                      <p className="text-sm text-destructive">
                        {errors.bairro.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua"
                      {...register("street")}
                      aria-invalid={!!errors.street}
                    />
                    {errors.street && (
                      <p className="text-sm text-destructive">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="number">Numero</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        {...register("number")}
                        aria-invalid={!!errors.number}
                      />
                      {errors.number && (
                        <p className="text-sm text-destructive">
                          {errors.number.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="complement">
                        Complemento{" "}
                        <span className="text-muted-foreground">
                          (opcional)
                        </span>
                      </Label>
                      <Input
                        id="complement"
                        placeholder="Sala 101, Bloco A..."
                        {...register("complement")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="h-max">
              <CardContent className="flex flex-col gap-6">
                {/* Amenities */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Amenidades
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Atualize as amenidades disponiveis no sala.
                  </p>
                </div>

                {/* Selected amenities */}
                {selectedAmenities.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <Label>Selecionadas ({selectedAmenities.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((id) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="gap-1 py-1 pl-3 pr-1"
                        >
                          {amenities.find((am) => am.id === id)?.name}
                          <button
                            type="button"
                            onClick={() => removeAmenity(id)}
                            className="rounded-sm p-0.5 hover:bg-muted-foreground/20"
                            aria-label={`Remover ${id}`}
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Backend amenities */}
                {amenities.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <Label>Recursos disponíveis</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {amenities.map((amenity) => (
                        <label
                          key={amenity.id}
                          className="
                            flex cursor-pointer items-center gap-3 rounded-lg
                            border border-input px-4 py-3 transition-colors
                            hover:bg-muted/50 has-checked:border-primary 
                            has-checked:bg-primary/5
                          "
                        >
                          <Checkbox
                            checked={selectedAmenities.includes(amenity.id)}
                            onCheckedChange={() => toggleAmenity(amenity.id)}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {amenity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom amenity input */}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="custom-amenity">
                    Adicionar amenidade personalizada
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-amenity"
                      placeholder="Ex: Cafeteira Nespresso"
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomAmenity();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomAmenity}
                      disabled={!customAmenity.trim()}
                    >
                      <Plus className="size-4" />
                      <span className="hidden sm:inline">Adicionar</span>
                    </Button>
                  </div>
                </div>

                {errors.amenities && (
                  <p className="text-sm text-destructive">
                    {errors.amenities.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex col-span-3 gap-2 ml-auto">
            <Button
              type="button"
              disabled={isSubmitting}
              className="p-6 hover:cursor-pointer"
              variant="outline"
              onClick={() => router.push(MY_ANNOUNCE_ROUTE)}
            >
              <Trash />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="p-6 hover:cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={24} />
                  Salvar Alterações
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

