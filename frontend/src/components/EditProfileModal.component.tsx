import { X, Calendar, MapPin, Mail, Phone } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
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
              Teodoro da Silva Teobaldo
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
              type="text"
              defaultValue="17/04/2000"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <MapPin size={16} /> Endereço
            </label>
            <input
              type="text"
              defaultValue="Cremação, Belém PA"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              defaultValue="teosilva@email.com.br"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} /> Celular
            </label>
            <input
              type="text"
              defaultValue="(91) 99222-4455"
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
                  defaultChecked
                  className="accent-red-500"
                />{" "}
                Homem
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Mulher"
                  className="accent-red-500"
                />{" "}
                Mulher
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="Outro"
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
            onClick={onClose} // <-- ADICIONE ISSO AQUI!
            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
