import { z } from "zod";
import { EnumRoomStatus, EnumRoomType } from "@/types/room";

export const stepBasicInfoSchema = z.object({
  name: z.string().min(3, "Nome deve ter no minimo 3 caracteres"),
  description: z.string().min(10, "Descricao deve ter no minimo 10 caracteres"),
  status: z.nativeEnum(EnumRoomStatus, {
    errorMap: () => ({ message: "Selecione um Status" }),
  } as any),
  type: z.nativeEnum(EnumRoomType, {
    errorMap: () => ({ message: "Selecione um tipo de espaco" }),
  } as any),
  size: z.coerce
    .number({ invalid_type_error: "Informe um valor válido" } as any)
    .int("Capacidade deve ser um nímero inteiro")
    .positive("Capacidade deve ser maior que zero"),
  price: z.coerce
    .number({ invalid_type_error: "Informe um valor válido" } as any)
    .positive("Preço deve ser maior que zero")
    .refine((val) => Number.isInteger(val * 100), {
      message: "Preço deve ter no máximo 2 casas decimais",
    })
    .transform((val) => Number(val.toFixed(2))),
  totalSpace: z.coerce
    .number({ invalid_type_error: "Informe um valor válido" } as any)
    .int("Capacidade deve ser um nímero inteiro")
    .positive("Capacidade deve ser maior que zero"),
});

export const stepAddressSchema = z.object({
  cep: z.string().min(8, "CEP deve ter 8 digitos").max(9, "CEP inválido"),
  state: z.string().min(2, "Informe o estado"),
  city: z.string().min(2, "Informe a cidade"),
  bairro: z.string().min(2, "Informe o bairro"),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().min(1, "Informe o nímero"),
  complement: z.string().optional(),
});

export const stepAmenitiesSchema = z.object({
  amenities: z.array(z.number()).min(1, "Selecione pelo menos um recurso"),
});

export const createRoomFormSchema = z.object({
  ...stepBasicInfoSchema.shape,
  ...stepAddressSchema.shape,
  ...stepAmenitiesSchema.shape,
});

export type CreateRoomFormValues = z.infer<typeof createRoomFormSchema>;

export const stepSchemas = [
  stepBasicInfoSchema,
  stepAddressSchema,
  stepAmenitiesSchema,
  z.object({}),
] as const;

