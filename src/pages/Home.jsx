import React from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { CanCard } from "../components/CanCard";
import { ShieldAlert, Zap } from "lucide-react";

export const Home = () => {
  const { monsters, stats } = useAppData();
  const { user, loading } = useAuth();
  
  const featured = monsters.slice(0, 6); // Grab first 6 for featured

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-monster-dark noise-bg" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-monster-dark via-transparent to-transparent opacity-90" />
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-8xl md:text-[12rem] font-display text-monster-white uppercase tracking-tighter leading-none select-none italic">
            MONSTER
          </h1>
          <h2 className="text-4xl md:text-[4.5rem] text-[#39ff14] font-display font-light mt-[-1rem] md:mt-[-2.5rem] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)] italic">
            For Collectors
          </h2>
          <h4 className="text-xl md:text-3xl text-monster-white font-display tracking-[0.3em] font-bold mb-8 uppercase">
            For every monster collector
          </h4>
          
          <div className="flex gap-4 mt-8 flex-wrap justify-center min-h-[56px] items-center">
            {!loading && (
              <>
                <Link to="/catalog">
                  <Button size="lg" className="text-lg">Explorar Catálogo</Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button size="lg" variant="outline">Criar Conta</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floating elements or absolute badges */}
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-monster-neon/20 bg-monster-gray/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-5xl font-display text-monster-neon glow-text">{stats.totalCans}+</span>
            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Latas no Catálogo</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-5xl font-display text-monster-neon glow-text">{stats.totalCollectors.toLocaleString()}</span>
            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Colecionadores Ativos</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-5xl font-display text-monster-neon glow-text">{stats.totalCollectedItems.toLocaleString()}</span>
            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Itens Coletados</span>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Zap className="text-monster-neon h-8 w-8" />
            <h2 className="text-4xl font-display text-monster-white">Destaques</h2>
          </div>
          <Link to="/catalog" className="text-monster-neon hover:glow-text font-bold text-sm tracking-widest uppercase">
            Ver Todas &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {featured.map(monster => (
            <CanCard key={monster.id} monster={monster} />
          ))}
        </div>
      </section>
    </div>
  );
};
