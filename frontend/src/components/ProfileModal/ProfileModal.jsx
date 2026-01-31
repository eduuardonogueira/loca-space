import React, { useState, useRef } from "react";
import "./ProfileModal.css";

export const ProfileModal = ({ isOpen, onClose }) => {
  // 1. Estado para guardar a URL da foto (começa com o placeholder)
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150",
  );

  // 2. Referência para o input de arquivo escondido
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nascimento: "",
    endereco: "",
    email: "tcosilva@email.com.br",
    celular: "(91) 99222-4455",
    sexo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Função Mágica: Pega o arquivo e mostra na tela
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Pega o primeiro arquivo selecionado
    if (file) {
      // Cria uma URL falsa temporária só para mostrar a imagem agora
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Salvando Perfil!\n\nFoto atualizada!\nEmail: ${formData.email}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <button className="close-icon" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-section">
          <div className="photo-circle">
            {/* A imagem agora obedece ao estado profileImage */}
            <img src={profileImage} alt="Foto" />
          </div>
          <div className="profile-info">
            <h3>Teodoro da Silva</h3>
            <span className="status">● Online</span>

            {/* Ao clicar aqui, ativamos o input escondido lá embaixo */}
            <p
              className="change-photo"
              onClick={() => fileInputRef.current.click()}
            >
              Alterar Foto
            </p>

            {/* O input invisível que faz o trabalho pesado */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*" // Aceita apenas imagens
              onChange={handleImageChange}
            />
          </div>
        </div>

        <form>
          <div className="input-group">
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="nascimento"
              value={formData.nascimento}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Ex: Cremação, Belém PA"
              value={formData.endereco}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Celular</label>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Sexo</label>
            <div className="radio-options">
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="homem"
                  onChange={handleChange}
                />{" "}
                Homem
              </label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="mulher"
                  onChange={handleChange}
                />{" "}
                Mulher
              </label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="outro"
                  onChange={handleChange}
                />{" "}
                Outro
              </label>
            </div>
          </div>
        </form>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={handleSave}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
