import React, { useState, useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { CanCard } from "../components/CanCard";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";

export const Catalog = () => {
  const { getItems } = useAppData();
  const { user } = useAuth();
  
  const rawItems = getItems();

  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'owned', 'missing'
  
  const [filterRarity, setFilterRarity] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterLine, setFilterLine] = useState("all");

  const distinctCountries = useMemo(() => Array.from(new Set(rawItems.map(i => i.country))).sort(), [rawItems]);
  const distinctLines = useMemo(() => Array.from(new Set(rawItems.map(i => i.line))).sort(), [rawItems]);

  const filteredItems = useMemo(() => {
    let result = rawItems;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.flavor.toLowerCase().includes(s) || 
        m.line.toLowerCase().includes(s)
      );
    }

    if (filterRarity !== "all") {
       result = result.filter(m => m.rarity === filterRarity);
    }
    if (filterCountry !== "all") {
       result = result.filter(m => m.country === filterCountry);
    }
    if (filterLine !== "all") {
       result = result.filter(m => m.line === filterLine);
    }

    if (user && filterMode !== "all") {
      if (filterMode === "owned") {
        result = result.filter(m => user.collection.includes(m.id));
      } else if (filterMode === "missing") {
        result = result.filter(m => !user.collection.includes(m.id));
      }
    }

    return result;
  }, [rawItems, search, filterMode, filterRarity, filterCountry, filterLine, user]);

  const clearFilters = () => {
     setSearch("");
     setFilterMode("all");
     setFilterRarity("all");
     setFilterCountry("all");
     setFilterLine("all");
  };

  const isFiltered = search || filterMode !== "all" || filterRarity !== "all" || filterCountry !== "all" || filterLine !== "all";

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="bg-monster-gray/50 border border-monster-neon/20 p-6 clip-diagonal">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-display uppercase tracking-widest text-monster-neon flex items-center gap-2">
               <Filter className="h-5 w-5" /> Filtros
             </h3>
             {isFiltered && (
                <button onClick={clearFilters} className="text-[10px] uppercase font-bold text-gray-400 hover:text-monster-red flex items-center gap-1 transition-colors">
                   <RefreshCw className="h-3 w-3" /> Limpar
                </button>
             )}
          </div>
          
          <div className="space-y-6 font-bold text-sm tracking-widest uppercase">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar lata..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121212] border border-white/20 focus:border-monster-neon focus:glow-border outline-none py-2 pl-9 pr-4 text-white text-xs transition-all clip-diagonal-btn"
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] text-gray-500">Linha / Família</label>
               <select value={filterLine} onChange={e => setFilterLine(e.target.value)} className="w-full bg-[#121212] border border-white/20 p-2 text-white outline-none focus:border-monster-neon appearance-none text-xs">
                  <option value="all">Todas as Linhas</option>
                  {distinctLines.map(l => <option key={l} value={l}>{l}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] text-gray-500">País</label>
               <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="w-full bg-[#121212] border border-white/20 p-2 text-white outline-none focus:border-monster-neon appearance-none text-xs">
                  <option value="all">Qualquer País</option>
                  {distinctCountries.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] text-gray-500">Raridade</label>
               <select value={filterRarity} onChange={e => setFilterRarity(e.target.value)} className="w-full bg-[#121212] border border-white/20 p-2 text-white outline-none focus:border-monster-neon appearance-none text-xs">
                  <option value="all">Qualquer Raridade</option>
                  <option value="Comum">Comum</option>
                  <option value="Incomum">Incomum</option>
                  <option value="Raro">Raro</option>
                  <option value="Muito Raro">Muito Raro</option>
                  <option value="Ultra Raro">Ultra Raro</option>
                  <option value="Lendário">Lendário</option>
                  <option value="Edição Limitada">Edição Limitada</option>
                  <option value="Descontinuado">Descontinuado</option>
                  <option value="Exclusivo Regional">Exclusivo Regional</option>
                  <option value="Protótipo">Protótipo</option>
               </select>
            </div>

            {user && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-[10px] text-gray-400">Coleção Pessoal</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-monster-neon bg-black/30 w-full p-2 border border-white/5 clip-diagonal-btn">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "all"} 
                      onChange={() => setFilterMode("all")}
                      className="accent-monster-neon"
                    />
                    <span className="text-[10px]">Mostrar Tudo</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-monster-neon bg-black/30 w-full p-2 border border-white/5 clip-diagonal-btn">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "owned"} 
                      onChange={() => setFilterMode("owned")}
                      className="accent-monster-neon"
                    />
                    <span className="text-[10px]">Apenas o que tenho</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-monster-neon bg-black/30 w-full p-2 border border-white/5 clip-diagonal-btn">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "missing"} 
                      onChange={() => setFilterMode("missing")}
                      className="accent-monster-neon"
                    />
                    <span className="text-[10px]">O que me falta</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1 w-full">
        <div className="mb-6 flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-sm">
          <span>{filteredItems.length} Latas Encontradas</span>
          {user && (
             <span className="text-monster-neon">VocÊ TEM {user.collection.length} de {rawItems.length}</span>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-24 text-gray-500 bg-monster-gray/20 border border-dashed border-white/10 clip-diagonal">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <h4 className="font-display text-xl mb-2 text-white uppercase tracking-widest">Nenhuma lata encontrada</h4>
            <p className="font-body text-sm">Tente limpar os filtros ou buscar por outros termos.</p>
            {isFiltered && (
               <Button onClick={clearFilters} variant="outline" className="mt-6 mx-auto">
                  Limpar Todos os Filtros
               </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <CanCard key={item.id} monster={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
