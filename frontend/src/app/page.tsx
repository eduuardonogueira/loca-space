import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans relative">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Sala de Reunião Coworking" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="relative z-50 bg-white h-[80px] px-6 md:px-12 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#E85D46] font-bold text-2xl tracking-tight cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>LocaSpace</span>
        </div>

        {/* Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-gray-700">
          <a href="#" className="flex items-center gap-2 hover:text-[#E85D46] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Anunciar
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#E85D46] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Favoritos
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#E85D46] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Mensagens
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#E85D46] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Meus Anúncios
          </a>
        </nav>

        {/* Botão Entrar */}
        <button className="flex items-center gap-2 border border-[#E85D46] text-[#E85D46] px-5 py-2 rounded-full font-bold text-sm hover:bg-red-50 transition bg-white">
          <div className="bg-[#E85D46] text-white rounded-full p-0.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          Entrar
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </header>

      {/* --- HERO CONTENT --- */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 pb-20">
        
        {/* Textos Principais */}
        <div className="w-full max-w-[1200px] mx-auto mb-10">
          <h1 className="text-white text-4xl md:text-[56px] font-bold mb-4 drop-shadow-lg leading-tight">
            Encontre a sala <br/> ideal para você
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold drop-shadow-md">
            Conte com a LocaSpace na sua Jornada
          </p>
        </div>

        <div className="bg-white rounded-[10px] p-6 md:p-8 shadow-xl w-full max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row gap-5 items-end">
            
            {/* Input Localidade */}
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-[16px] font-bold text-gray-900 mb-3">
                <svg className="text-gray-900" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Localidade
              </label>
              <input 
                type="text" 
                placeholder="Digite a cidade, bairro ou rua" 
                className="w-full h-[56px] border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-500 outline-none focus:border-[#E85D46] focus:ring-1 focus:ring-[#E85D46] transition text-[15px]"
              />
            </div>

            {/* Input Tipo de Sala */}
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-[16px] font-bold text-gray-900 mb-3">
                <svg className="text-gray-900" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Tipo de Sala
              </label>
              <input 
                type="text" 
                placeholder="Todos os tipos" 
                className="w-full h-[56px] border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-500 outline-none focus:border-[#E85D46] focus:ring-1 focus:ring-[#E85D46] transition text-[15px]"
              />
            </div>

            {/* Botão Pesquisar */}
            <button className="h-[56px] w-[60px] bg-[#E85D46] hover:bg-[#d64c37] text-white rounded-lg transition shadow-md flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>

          </div>
        </div>

      </section>
    </main>
  );
}