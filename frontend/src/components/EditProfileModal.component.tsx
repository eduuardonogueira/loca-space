"use client";

import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { updateUserProfile, uploadUserAvatar } from "@/services/auth";
import { EnumUserGender, IUser, UserGender } from "@/types/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ProfileImageUpload } from "./ProfileImageUpload.component";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IUser | null;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<UserGender>("outros");

  const [street, setStreet] = useState("");
  const [bairro, setBairro] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setBirthDate(profile.birthDate ? profile.birthDate.toString() : "");
      setPhone(profile.phone || "");
      setGender(profile.gender || "outros");

      setStreet(profile.address?.street || "");
      setBairro(profile.address?.bairro || "");
      setCity(profile.address?.city || "");
      setState(profile.address?.state || "");
    }
  }, [profile]);

  const handleConfirm = async () => {
    if (!profile?.id) return;

    try {
      setIsSaving(true);

      const payload = {
        email,
        birthDate: new Date(birthDate),
        phone,
        gender,
        address: {
          street,
          bairro,
          city,
          state,
        },
      };

      let userResponse;

      if (profileImage) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", profileImage);

        const [user, _image] = await Promise.all([
          updateUserProfile(profile.id, payload),
          uploadUserAvatar(profile.id, avatarFormData),
        ]);

        userResponse = user;
      } else {
        userResponse = await updateUserProfile(profile.id, payload);
      }

      if (userResponse?.id) {
        toast.success("Perfil atualizado com sucesso!");
        window.location.reload();
      } else {
        toast.error("Erro ao atualizar o perfil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[30px] w-full max-w-100 p-8 relative shadow-2xl font-sans max-h-[90vh] overflow-y-auto">
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
            <ProfileImageUpload
              file={profileImage}
              onChange={setProfileImage}
              avatarUrl={profile?.avatarUrl}
              size={80}
            />
            <span className="text-xs text-gray-400 mt-2 cursor-pointer hover:text-gray-600 transition-colors">
              Alterar Foto
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight w-36">
              {profile?.fullName || "Carregando..."}
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
              value={birthDate ?? ""}
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
                  checked={gender === "masculino"}
                  onChange={() => setGender(EnumUserGender.MALE)}
                  className="accent-red-500"
                />{" "}
                Homem
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Feminino"
                  checked={gender === "feminino"}
                  onChange={() => setGender(EnumUserGender.FEMALE)}
                  className="accent-red-500"
                />{" "}
                Mulher
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Outro"
                  checked={gender === "outros"}
                  onChange={() => setGender(EnumUserGender.OTHERS)}
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
            {isSaving ? "Atualizando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

