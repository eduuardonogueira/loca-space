"use client";

import { login } from "@/app/actions";
import { HOME_ROUTE, SIGNUP_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";

    const newErrors: typeof errors = {};
    if (!username) newErrors.username = "O email é obrigatório.";
    if (!password) newErrors.password = "A senha é obrigatória.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    const isLogged = await login(username, password);

    if (isLogged) {
      toast.success("Login realizado com sucesso!");
      router.push(HOME_ROUTE);
    } else {
      toast.error("Usuário ou senha incorretos");
    }

    setIsLoading(false);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="/login-bg.webp"
          alt="Reunião de trabalho"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-16 left-16 text-white font-semibold text-4xl">
          LocaSpace
        </div>
        <div className="absolute bottom-16 left-16 max-w-md text-white">
          <h1 className="text-3xl font-bold leading-snug">
            O espaço perfeito para <br /> sua necessidade.
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-2xl font-semibold text-red-500">
            Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Entre com suas credenciais para acessar o sistema
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                name="username"
                type="username"
                placeholder="Digite seu email"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha:
              </label>
              <input
                name="password"
                type="password"
                placeholder="Digite sua senha"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full rounded-md bg-red-500 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link href={SIGNUP_ROUTE} className="text-blue-500 hover:underline">
              Inscreva-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

