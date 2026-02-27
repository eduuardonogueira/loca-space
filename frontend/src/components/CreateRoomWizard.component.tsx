"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  MapPin,
  Sparkles,
  ImageIcon,
  Plus,
  X,
  Search,
} from "lucide-react";

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
  stepSchemas,
  type CreateRoomFormValues,
} from "@/lib/schemas/createRoomSchema";
import {
  CreateRoomPayload,
  EnumRoomStatus,
  EnumRoomType,
  RoomTypeLabels,
  type IAmenity,
} from "@/types/room";
import {
  createRoom,
  uploadRoomBanner,
  uploadRoomPhotos,
} from "@/services/room";
import { ImageUpload, StepsFooter, StepsHeader } from "@/components";
import { Button } from "./ui/button";
import { MY_ANNOUNCE_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import useCep from "@/hooks/useCep";
import { toast } from "react-toastify";

const STEPS = [
  { id: 0, label: "Dados Básicos", icon: Building2 },
  { id: 1, label: "Endereco", icon: MapPin },
  { id: 2, label: "Recursos", icon: Sparkles },
  { id: 3, label: "Imagens", icon: ImageIcon },
];

interface CreateRoomWizardProps {
  amenities: IAmenity[];
}

export function CreateRoomWizard({ amenities }: CreateRoomWizardProps) {
  const router = useRouter();
  const { formatCep } = useCep();

  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAmenity, setCustomAmenity] = useState("");
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      price: undefined,
      totalSpace: undefined,
      size: undefined,
      status: EnumRoomStatus.AVAILABLE,
      cep: "",
      state: "",
      city: "",
      bairro: "",
      street: "",
      number: "",
      complement: "",
      amenities: [],
    },
  });

  const selectedAmenities = watch("amenities") ?? [];

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
      selectedAmenities.filter((id) => id !== id),
      { shouldValidate: true },
    );
    setCustomAmenities((prev) => prev.filter((id) => id !== id));
  };

  // const goToStep = async (targetStep: number) => {
  //   if (targetStep > currentStep) {
  //     const schema = stepSchemas[currentStep];
  //     const fields = Object.keys(schema.shape) as Array<
  //       keyof CreateRoomFormValues
  //     >;
  //     const isValid = await trigger(fields);
  //     if (!isValid) return;
  //   }
  //   setCurrentStep(targetStep);
  // };

  const goToStep = async (targetStep: number) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    const schema = stepSchemas[currentStep];
    const values = getValues();

    const result = schema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof CreateRoomFormValues;
        setError(field, {
          type: "manual",
          message: err.message,
        });
      });
      return;
    }

    if (currentStep === 2 && !currentRoomId) {
      try {
        setIsSubmitting(true);

        const payload: CreateRoomPayload = {
          name: values.name,
          description: values.description,
          type: values.type,
          price: values.price,
          size: values.size,
          status: values.status,
          totalSpace: values.totalSpace,
          address: {
            cep: values.cep.replace(/\D/g, ""),
            state: values.state,
            city: values.city,
            bairro: values.bairro,
            street: values.street,
            number: values.number,
            complement: values.complement || undefined,
          },
          amenities: values.amenities,
        };

        const result = await createRoom(payload);

        if (!result.success || !result.data?.id) {
          toast.error(result.error || "Erro ao criar espaço");
          return;
        }

        setCurrentRoomId(result.data.id);
        toast.success("Espaço criado com sucesso!");
      } catch {
        toast.error("Erro ao criar espaço");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    setCurrentStep(targetStep);
  };

  const onSubmit = useCallback(async () => {
    if (!currentRoomId) {
      toast.error("Sala não encontrada para envio das imagens");
      return;
    }

    try {
      setIsSubmitting(true);

      if (bannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append("banner", bannerFile);

        const bannerResult = await uploadRoomBanner(
          currentRoomId,
          bannerFormData,
        );

        if (!bannerResult.success) {
          toast.error("Erro ao enviar banner");
        }
      }

      if (photoFiles.length > 0) {
        const photosFormData = new FormData();

        photoFiles.forEach((file) => {
          photosFormData.append("photos", file);
        });

        const photosResult = await uploadRoomPhotos(
          currentRoomId,
          photosFormData,
        );

        if (!photosResult.success) {
          toast.error("Erro ao enviar fotos");
        }
      }

      toast.success("Espaço criado com sucesso!");
      router.push(MY_ANNOUNCE_ROUTE);
    } catch {
      toast.error("Erro inesperado ao enviar imagens");
    } finally {
      setIsSubmitting(false);
    }
  }, [bannerFile, photoFiles, currentRoomId, router]);

  return (
    <div className="flex flex-col gap-8">
      <StepsHeader
        goToStep={goToStep}
        currentStep={currentStep}
        steps={STEPS}
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            {/* Step 1: Dados Basicos */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-red-500">
                    Informações do Espaco
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados basicos do seu espaco.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nome do espaco</Label>
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
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o espaço, suas caracteristicas e diferenciais..."
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
                      <Label htmlFor="type">Tipo de espaço</Label>
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="pricePerHour">Preco por hora (R$)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          R$
                        </span>
                        <Input
                          id="pricePerHour"
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
                </div>
              </div>
            )}

            {/* Step 2: Endereco */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Endereco do Espaco
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Informe o endereco completo. O CEP preenchera
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
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="bairro"
                      placeholder="Bairro"
                      {...register("bairro")}
                      type="text"
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Recursos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Selecione os recursos disponíveis no espaco ou adicione
                    novas.
                  </p>
                </div>

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
                          {amenities.find((a) => a.id === id)?.name}
                          <button
                            type="button"
                            onClick={() => removeAmenity(id)}
                            className="rounded-sm p-0.5 hover:bg-muted-foreground/20"
                            aria-label={`Remover ${name}`}
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
                    Adicionar recursos personalizado
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
              </div>
            )}

            {/* Step 4: Imagens */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Imagens do Espaco
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Adicione um banner e fotos para seu espaco. As imagens serao
                    enviadas apos a criacao.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Banner</Label>
                    <p className="text-xs text-muted-foreground">
                      Imagem principal do espaco. Recomendado: 1200x400px.
                    </p>
                    <ImageUpload
                      files={bannerFile ? [bannerFile] : []}
                      onFilesChange={(files) => setBannerFile(files[0] ?? null)}
                      maxFiles={1}
                      accept="image/*"
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Label>Fotos do espaco</Label>
                    <p className="text-xs text-muted-foreground">
                      Adicione ate 10 fotos mostrando diferentes angulos e
                      detalhes.
                    </p>
                    <ImageUpload
                      files={photoFiles}
                      onFilesChange={setPhotoFiles}
                      maxFiles={10}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <StepsFooter
          goToStep={goToStep}
          steps={STEPS}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}

