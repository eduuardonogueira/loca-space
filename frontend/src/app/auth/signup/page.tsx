"use client";

import { useCallback, useState } from "react";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { signup, uploadUserAvatar } from "@/services";
import {
  CreateUserPayload,
  EnumUserGender,
  EnumUserRole,
  EnumUserType,
  UserGenderLabels,
  UserTypeLabels,
} from "@/types/user";
import { Building2, ImageIcon, MapPin, KeyRound, Search } from "lucide-react";
import { ImageUpload, StepsFooter, StepsHeader } from "@/components";
import {
  createUserFormSchema,
  CreateUserFormValues,
  userStepSchemas,
} from "@/lib/schemas/createUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCep from "@/hooks/useCep";

export default function RegisterPage() {
  const router = useRouter();
  const { formatCep } = useCep();

  const STEPS = [
    { id: 0, label: "Dados Básicos", icon: Building2 },
    { id: 1, label: "Endereco", icon: MapPin },
    { id: 2, label: "Senha", icon: KeyRound },
    { id: 3, label: "Imagem", icon: ImageIcon },
  ];

  const [currentStep, setCurrentStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      type: EnumUserType.CLIENT,
      role: EnumUserRole.USER,
      gender: undefined,
      phone: undefined,
      birthDate: undefined,
      cep: "",
      state: "",
      city: "",
      bairro: "",
      street: "",
      number: "",
      complement: "",
      password: "",
      confirm: "",
    },
  });

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

  const onSubmit = useCallback(async (data: CreateUserFormValues) => {
    console.log("chamou");

    const payload: CreateUserPayload = {
      ...data,
      address: {
        state: data.state,
        city: data.city,
        bairro: data.bairro,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
      },
    };

    if (!userId) {
      try {
        setIsSubmitting(true);
        const response = await signup(payload);

        if (!response) {
          toast.error("Erro ao realizar cadastro. tente novamente");
        }

        toast.success("Cadastro realizado com sucesso!");
        router.push(LOGIN_ROUTE);
        return;
      } catch (error) {
        toast.error(`Erro ao realizar cadastro. ${error}`);
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (!avatarFile) return;

    try {
      setIsSubmitting(true);
      const userFormData = new FormData();
      userFormData.append("avatar", avatarFile);

      const response = await uploadUserAvatar(userId, userFormData);

      if (!response.success) {
        toast.error(
          "cadastro realizado, mas houve erro ao enviar a foto de perfil",
        );
      }

      router.push(LOGIN_ROUTE);
      return;
    } catch (error) {
      toast.error(`Erro ao enviar avatar. ${error}`);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const goToStep = async (targetStep: number) => {
    if (targetStep > currentStep) {
      const schema = userStepSchemas[currentStep];
      const fields = Object.keys(schema.shape) as Array<
        keyof CreateUserFormValues
      >;
      const isValid = await trigger(fields);
      if (!isValid) return;
    }
    setCurrentStep(targetStep);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="/cadastro-bg.webp"
          alt="Duas pessoas conversando"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-16 left-16 text-white font-semibold text-4xl">
          LocaSpace
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-md">
          <h2 className="text-center text-3xl font-semibold text-red-500 mb-8">
            Crie sua conta
          </h2>

          <StepsHeader
            goToStep={goToStep}
            currentStep={currentStep}
            steps={STEPS}
          />

          <form
            className="mt-6 grid grid-cols-1 gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Card>
              <CardContent>
                {currentStep === 0 && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Informações Pessoais
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Para iniciarmos o cadastro, preencha o formulário com
                        seus dados básicos
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName">Nome Completo:</Label>
                        <Input
                          type="text"
                          id="fullName"
                          placeholder="João da Silva Figueiredo"
                          {...register("fullName")}
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email:</Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="joao.silva@email.com"
                          {...register("email")}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="gender">Gênero:</Label>
                          <Select
                            onValueChange={(value) =>
                              setValue("gender", value as EnumUserGender, {
                                shouldValidate: true,
                              })
                            }
                            value={watch("gender")}
                          >
                            <SelectTrigger className="w-full" id="type">
                              <SelectValue placeholder="Selecione seu gênero" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(EnumUserGender).map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {UserGenderLabels[gender]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className="text-sm text-destructive">
                              {errors.gender.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="type">Tipo:</Label>
                          <Select
                            onValueChange={(value) =>
                              setValue("type", value as EnumUserType, {
                                shouldValidate: true,
                              })
                            }
                            value={watch("type")}
                          >
                            <SelectTrigger className="w-full" id="type">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(EnumUserType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {UserTypeLabels[type]}
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
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="phone">Telefone:</Label>
                          <Input
                            id="phone"
                            type="number"
                            placeholder="(91) 9 8888-7777"
                            {...register("phone")}
                            aria-invalid={!!errors.phone}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="birthDate">Data de Nascimento:</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            {...register("birthDate")}
                            aria-invalid={!!errors.birthDate}
                          />
                          {errors.birthDate && (
                            <p className="text-sm text-destructive">
                              {errors.birthDate.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Preencha seu Endereco
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Informe seu endereco completo. O CEP preencherá
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
                            placeholder="Bloco A..."
                            {...register("complement")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Credenciais
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Agora, basta definir uma senha para você acessar sua
                        conta em nossa plataforma
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName">Senha:</Label>
                        <Input
                          type="password"
                          id="password"
                          placeholder="Digite sua senha"
                          {...register("password")}
                          aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                          <p className="text-sm text-destructive">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="confirm">Confirmar senha:</Label>
                        <Input
                          type="password"
                          id="confirm"
                          placeholder="Digite sua senha novamente"
                          {...register("confirm")}
                          aria-invalid={!!errors.confirm}
                        />
                        {errors.confirm && (
                          <p className="text-sm text-destructive">
                            {errors.confirm.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Imagem de Perfil
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma imagem de perfil para passar mais confiança
                        aos usuários!
                      </p>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <Label>Avatar</Label>
                        <p className="text-xs text-muted-foreground">
                          Image de Perfil
                        </p>
                        <ImageUpload
                          files={avatarFile ? [avatarFile] : []}
                          onFilesChange={(files) =>
                            setAvatarFile(files[0] ?? null)
                          }
                          maxFiles={1}
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <StepsFooter
              goToStep={goToStep}
              steps={STEPS}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isSubmitting={isSubmitting}
            />
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Já possui uma conta?{" "}
            <Link href={LOGIN_ROUTE} className="text-blue-500 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

