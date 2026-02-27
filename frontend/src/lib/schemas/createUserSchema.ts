import { z } from "zod";
import { EnumUserGender, EnumUserRole, EnumUserType } from "@/types/user";

export const stepUserBasicInfoSchema = z.object({
  fullName: z.string().min(5, "Nome deve ter no minimo 5 caracteres"),
  email: z.email("Insira um endereço de email válido"),
  type: z.enum(EnumUserType, { error: "Selecione um tipo" }),
  role: z.enum(EnumUserRole, { error: "Selecione uma função" }),
  gender: z.enum(EnumUserGender, {
    error: "Selecione um gênero",
  }),
  phone: z
    .string()
    .min(10, "Número deve conter no mínimo 10 dígitos")
    .max(13, "Número deve conter no máximo 13 dígitos")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  birthDate: z.coerce
    .date({
      error: "Data de nascimento obrigatória",
    })
    .min(new Date("1900-01-01"), {
      message: "Data muito antiga",
    })
    .max(new Date(), {
      message: "Data não pode ser no futuro",
    }),
});

export const stepUserAddressSchema = z.object({
  cep: z.string().min(8, "CEP deve ter 8 digitos").max(9, "CEP inválido"),
  state: z.string().min(2, "Informe o estado"),
  city: z.string().min(2, "Informe a cidade"),
  bairro: z.string().min(2, "Informe o bairro"),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
});

export const stepCredentialsSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirm: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirm, {
    error: "As senhas não coincidem",
    path: ["confirm"],
  });

export const createUserFormSchema = z.object({
  ...stepUserBasicInfoSchema.shape,
  ...stepUserAddressSchema.shape,
  ...stepCredentialsSchema.def.shape,
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const userStepSchemas = [
  stepUserBasicInfoSchema,
  stepUserAddressSchema,
  stepCredentialsSchema,
  z.object({}),
] as const;

