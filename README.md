# 📚 Campus Click

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)  
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://campus-click-nine.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Campus Click** é um sistema web para gestão de reservas de salas e laboratórios da UFRA, desenvolvido com **Next.js**, **NestJS**, **TypeScript**, **Prisma** e **PostgreSQL**.  
O projeto busca otimizar o agendamento de espaços acadêmicos de forma simples, rápida e segura.

## 🔍 Visão Geral

- 🔑 Autenticação de usuários  
- 📅 Reserva de salas e laboratórios  
- ✅ Acompanhamento do status da reserva (pendente, aprovada, recusada)  
- 🛠️ Painel administrativo para gerenciar reservas e usuários  
- 📱 Interface responsiva e amigável  


## 🧰 Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) | [React](https://react.dev/) | [TypeScript](https://www.typescriptlang.org/) | [Tailwind](https://tailwindcss.com/) | [CSS Modules](https://developer.mozilla.org/pt-BR/docs/Web/CSS/)  
- **Backend:** [NestJS](https://nestjs.com/) | [TypeScript](https://www.typescriptlang.org/docs/)  
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)  
- **ORM / Migrações:** [Prisma](https://www.prisma.io/)  
- **Deploy:** [Vercel](https://vercel.com/) (frontend) + servidor / nuvem (backend)  


## 📁 Estrutura do Projeto

campus-click/
- ├── frontend/ # Aplicação cliente (Next.js + React).
- ├── backend/ # API e lógica de negócio (NestJS + Prisma).- 
- ├── .gitignore.
- ├── README.md.


## 🚀 Instalação & Setup

### Pré-requisitos

- Node.js (>= 16.x recomendado)  
- NPM ou Yarn  
- PostgreSQL configurado  
- Arquivos `.env` com variáveis de ambiente  

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/eduuardonogueira/campus-click.git
   cd campus-click
   
2. Backend:
    ```bash
    cd backend
    cp .env.example .env   # configure as variáveis de ambiente
    npm install
    npx prisma migrate dev
    npm run start:dev

3. Frontend:
    ```bash
    cd ../frontend
    cp .env.local.example .env.local
    npm install
    npm run dev
4. Acesse no navegador:
    ```bash
    - Frontend → http://localhost:3000
    - Backend → http://localhost:3001


## ⚙️ Uso

- Crie sua conta ou faça login
- Visualize salas disponíveis
- Realize reservas e acompanhe o status
- Administradores podem aprovar, recusar e gerenciar reservas


## 📦 Deploy

- Frontend → Campus Click no Vercel
- Backend → configurar servidor com Node.js e PostgreSQL
- Banco de dados → executar npx prisma migrate deploy em produção


## 🤝 Contribuição

- Contribuições são bem-vindas!
- Faça um fork do projeto
- Crie uma branch: git checkout -b minha-feature
- Faça suas alterações e commit: git commit -m 'minha feature'
- Envie para o repositório: git push origin minha-feature
- Abra um Pull Request 🎉

## 👥 Autores

- [Eduardo Nogueira](https://github.com/eduuardonogueira)
- [Hellry Moraes](https://github.com/HellryMoraes)
- Paulo 
- [Gabriel Inada](https://github.com/GabrielInada)
- [Wallace Guimarães](https://github.com/Wallace-Guimaraes)

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](https://opensource.org/license/mit/) para mais detalhes.

---
