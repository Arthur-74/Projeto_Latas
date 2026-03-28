import React, { useState, useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { CanCard } from "../components/CanCard";
import { Search, Filter } from "lucide-react";

export const Catalog = () => {
  const { monsters } = useAppData();
  const { user } = useAuth();
  
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'owned', 'missing'
  
  const filteredMonsters = useMemo(() => {
    let result = monsters;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.flavor.toLowerCase().includes(s) || 
        m.line.toLowerCase().includes(s)
      );
    }

    if (user && filterMode !== "all") {
      if (filterMode === "owned") {
        result = result.filter(m => user.collection.includes(m.id));
      } else if (filterMode === "missing") {
        result = result.filter(m => !user.collection.includes(m.id));
      }
    }

    return result;
  }, [monsters, search, filterMode, user]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-monster-gray/50 border border-monster-neon/20 p-4 clip-diagonal">
          <h3 className="text-xl font-display uppercase tracking-widest mb-4 text-monster-neon flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtros
          </h3>
          
          <div className="space-y-4 font-bold text-sm tracking-widest uppercase">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar lata..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-monster-dark border-2 border-monster-gray focus:border-monster-neon focus:glow-border outline-none py-2 pl-9 pr-4 text-monster-white transition-all clip-diagonal-btn"
              />
            </div>

            {user && (
              <div className="space-y-2 mt-6">
                <p className="text-gray-400 mb-2">Coleção</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-monster-neon">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "all"} 
                      onChange={() => setFilterMode("all")}
                      className="accent-monster-neon"
                    />
                    Mostrar Tudo
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-monster-neon">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "owned"} 
                      onChange={() => setFilterMode("owned")}
                      className="accent-monster-neon"
                    />
                    Apenas o que tenho
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-monster-neon">
                    <input 
                      type="radio" 
                      name="filterMode" 
                      checked={filterMode === "missing"} 
                      onChange={() => setFilterMode("missing")}
                      className="accent-monster-neon"
                    />
                    O que me falta
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
          <span>Mostrando {filteredMonsters.length} resultados</span>
          {user && (
             <span>Você possui {user.collection.length} de {monsters.length} latas</span>
          )}
        </div>

        {filteredMonsters.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            Nenhuma lata encontrada com estes filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {filteredMonsters.map(monster => (
              <CanCard key={monster.id} monster={monster} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
