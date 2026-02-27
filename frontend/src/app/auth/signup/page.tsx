"use client";

import { LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { signup } from "@/services";
import { EnumUserRole, EnumUserType, ICreateUser } from "@/types/user";

interface IFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  birthDate: string;
  type: string;
  role: string;
  address: {
    street: string;
    number: string;
    complement: string;
    bairro: string;
    city: string;
    state: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    birthDate: "",
    type: EnumUserType.CLIENT,
    role: EnumUserRole.USER,
    address: {
      street: "",
      number: "",
      complement: "",
      bairro: "",
      city: "",
      state: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [id]: value,
      },
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName) newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Digite sua senha novamente";
    if (!formData.type) newErrors.type = "Tipo é obrigatório";
    if (!formData.role) newErrors.role = "Perfil é obrigatório";
    if (!formData.address.street) newErrors.street = "Rua é obrigatória";
    if (!formData.address.bairro) newErrors.bairro = "Bairro é obrigatório";
    if (!formData.address.city) newErrors.city = "Cidade é obrigatória";
    if (!formData.address.state) newErrors.state = "Estado é obrigatório";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "As senhas não conferem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "As senhas não conferem",
      }));
      toast.error("As senhas informadas não são iguais.");
      return;
    }

    if (!validate()) {
      toast.error("Preencha os campos obrigatórios corretamente.");
      return;
    }

    setIsLoading(true);

    const payload: ICreateUser = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      gender: formData.gender || undefined,
      birthDate: formData.birthDate || undefined,
      type: formData.type as "cliente" | "locador",
      role: formData.role as "user" | "gerente" | "admin",
      address: {
        street: formData.address.street,
        number: formData.address.number || undefined,
        complement: formData.address.complement || undefined,
        bairro: formData.address.bairro,
        city: formData.address.city,
        state: formData.address.state,
      },
    };

    const data = await signup(payload);

    if (data) {
      toast.success("Cadastro realizado com sucesso!");
      router.push(LOGIN_ROUTE);
      return;
    }

    toast.error("Erro ao criar cadastro.");
    setIsLoading(false);
  }

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
          <h2 className="text-center text-2xl font-semibold text-red-500">
            Crie sua conta
          </h2>

          <form className="mt-6 grid grid-cols-1 gap-3" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo:
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Digite seu nome completo"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo:
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value={EnumUserType.CLIENT}>Cliente</option>
                  <option value={EnumUserType.OWNER}>Locador</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Perfil:
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value={EnumUserRole.USER}>User</option>
                  <option value={EnumUserRole.MANAGER}>Gerente</option>
                  <option value={EnumUserRole.ADMIN}>Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone:
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="91988887777"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gênero:
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Nascimento:
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha:
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirme sua Senha:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Digite sua senha novamente"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="rounded-md border border-gray-200 p-3">
              <p className="mb-2 text-sm font-semibold text-gray-800">Endereço</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Rua:</label>
                  <input
                    type="text"
                    id="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Número:</label>
                  <input
                    type="text"
                    id="number"
                    value={formData.address.number}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Complemento:</label>
                  <input
                    type="text"
                    id="complement"
                    value={formData.address.complement}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bairro:</label>
                  <input
                    type="text"
                    id="bairro"
                    value={formData.address.bairro}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {errors.bairro && (
                    <p className="mt-1 text-sm text-red-500">{errors.bairro}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cidade:</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Estado:</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full cursor-pointer rounded-md bg-red-500 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Cadastrar"}
            </button>
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
