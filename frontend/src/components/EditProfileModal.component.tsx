"use client";

import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { updateUserProfile } from "@/services/auth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
}

export function EditProfileModal({
  isOpen,
  onClose,
  userData,
}: EditProfileModalProps) {
  // 1. Estados para guardar TODOS os dados
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // Novos estados do Endereço divididos!
  const [street, setStreet] = useState("");
  const [bairro, setBairro] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // 2. Puxa os dados reais quando o modal abre
  useEffect(() => {
    if (userData) {
      setEmail(userData.email || "");
      setBirthDate(userData.birthDate || "");
      setPhone(userData.phone || "");
      setGender(userData.gender || "");

      // Se o usuário já tiver endereço salvo, preenche as 4 caixinhas
      setStreet(userData.address?.street || "");
      setBairro(userData.address?.bairro || "");
      setCity(userData.address?.city || "");
      setState(userData.address?.state || "");
    }
  }, [userData]);

  // 3. A função de envio com o Objeto Perfeito!
  const handleConfirm = async () => {
    if (!userData?.id) return;
    setIsSaving(true);

    const dadosAtualizados = {
      email: email,
      birthDate: birthDate,
      phone: phone,
      gender: gender,
      address: {
        street: street,
        bairro: bairro,
        city: city,
        state: state,
      },
    };

    const sucesso = await updateUserProfile(userData.id, dadosAtualizados);

    setIsSaving(false);

    if (sucesso) {
      alert("Perfil atualizado com sucesso!");
      window.location.reload();
    } else {
      alert("Erro ao atualizar o perfil.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[30px] w-full max-w-[400px] p-8 relative shadow-2xl font-sans max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Foto e Nome */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <img
              src="https://github.com/shadcn.png"
              alt="Foto de Perfil"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <span className="text-xs text-gray-400 mt-2 cursor-pointer hover:text-gray-600 transition-colors">
              Alterar Foto
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight w-36">
              {userData?.fullName || "Carregando..."}
            </h3>
            <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Online
            </p>
          </div>
        </div>

        {/* Formulário de Edição */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} /> Data de Nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          {/* Campo: Rua */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <MapPin size={16} /> Rua
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          {/* Campos: Bairro, Cidade e UF (Lado a Lado) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Bairro
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Estado (UF)
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                maxLength={2}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              required
              pattern=".*@.*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} /> Celular
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Sexo
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Homem"
                  checked={gender === "Homem"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-red-500"
                />{" "}
                Homem
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Mulher"
                  checked={gender === "Mulher"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-red-500"
                />{" "}
                Mulher
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Outro"
                  checked={gender === "Outro"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-red-500"
                />{" "}
                Outro
              </label>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
