// frontend/src/app/(dashboard)/home/page.tsx
export { default } from "../rooms/page";

      {/* --- CONTEÚDO HERO --- */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16">
        
        <div className="w-full max-w-[1200px] mx-auto mb-10">
          <h1 className="text-white text-4xl md:text-[56px] font-bold mb-4 drop-shadow-lg leading-tight">
            Encontre a sala <br/> ideal para você
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold drop-shadow-md">
            Conte com a LocaSpace na sua Jornada
          </p>
        </div>

        {/* CARD DE BUSCA */}
        <div className="bg-white rounded-[10px] p-6 md:p-8 shadow-xl w-full max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row gap-5 items-end">
            
            {/* Input Localidade*/}
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-[16px] font-bold text-gray-900 mb-3">
                <svg className="text-gray-900" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Localidade
              </label>
              <input 
                type="text" 
                placeholder="Digite a cidade, bairro ou rua" 
                className="w-full h-[56px] border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#E85D46] focus:ring-4 focus:ring-[#E85D46]/10"
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
                // Mantive apenas o foco bonito no input
                className="w-full h-[56px] border border-gray-300 rounded-lg px-4 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#E85D46] focus:ring-4 focus:ring-[#E85D46]/10"
              />
            </div>

            {/* Botão Pesquisar */}
            <button className="h-[56px] w-[60px] bg-[#E85D46] text-white rounded-lg flex items-center justify-center shrink-0 shadow-md transition-all duration-300 ease-out hover:bg-[#ff6b52] hover:shadow-[0_8px_20px_-6px_rgba(232,93,70,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>

          </div>
        </div>

      </section>
    </main>
  );
}