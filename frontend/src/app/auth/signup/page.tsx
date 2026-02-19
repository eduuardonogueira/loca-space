"use client";

import { login } from "@/app/actions";
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { signup } from "@/api";

interface IFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName) newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Digite sua senha novamente";
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
    setIsLoading(true);
    if (validate()) {
      const data = await signup(formData);

      if (!data || data.id) {
        toast.success("Cadastro realizado com sucesso!");
        router.push(LOGIN_ROUTE);
        return;
      }

      toast.error("Erro ao criar cadastro!");
      return;
    }

    toast.error("Você deve preencher todos os campos obrigatórios!");
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

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-2xl font-semibold text-red-500">
            Crie sua conta
          </h2>

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
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

            <button
              type="submit"
              className="cursor-pointer w-full rounded-md bg-red-500 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
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

