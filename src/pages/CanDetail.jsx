import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export const CanDetail = () => {
  const { id } = useParams();
  const { getMonsterById } = useAppData();
  const { user, updateCollection } = useAuth();
  
  const monster = getMonsterById(id);

  if (!monster) {
    return <div className="p-24 text-center text-white">Lata não encontrada</div>;
  }

  const isOwned = user?.collection?.includes(monster.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center text-gray-400 hover:text-monster-neon mb-8 font-bold tracking-widest text-sm uppercase transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Catálogo
      </Link>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Imagem (Left) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-monster-gray/50 clip-diagonal relative glow-border min-h-[500px]">
           <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
           <div className="absolute inset-0 bg-monster-neon/5 opacity-[0.02] pointer-events-none mix-blend-overlay" />
           {monster.imageUrl ? (
              <img src={monster.imageUrl} alt={monster.name} className="h-96 object-contain z-10 drop-shadow-[0_20px_50px_rgba(57,255,20,0.2)]" />
           ) : (
             <div className="text-white/20 flex flex-col items-center justify-center z-10">
               <div className="w-32 h-64 border-2 border-dashed border-white/20 rounded-xl" />
               <span className="text-lg uppercase mt-4 font-display tracking-widest text-white/30">Sem Imagem</span>
             </div>
           )}
        </div>

        {/* Info (Right) */}
        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant={monster.rarity}>{monster.rarity}</Badge>
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">{monster.year} • {monster.country}</span>
            </div>
            
            <h1 className="text-5xl font-display uppercase tracking-widest text-white mb-2">
              {monster.name}
            </h1>
            <p className="text-xl text-monster-neon font-display tracking-widest uppercase">
              Linha: {monster.line} • {monster.flavor}
            </p>
          </div>

          <div className="p-6 bg-monster-dark border-l-4 border-monster-neon text-gray-300 leading-relaxed font-body text-lg">
            {monster.description}
          </div>

          <div className="space-y-4">
            <h3 className="font-display tracking-widest text-gray-400 uppercase text-lg">Estatísticas</h3>
            <div className="bg-monster-gray/30 p-4 border border-white/10 rounded-sm">
              <div className="flex justify-between text-sm font-bold tracking-widest uppercase mb-2">
                <span>Colecionadores com esta lata</span>
                <span className="text-monster-neon">24%</span>
              </div>
              <div className="w-full h-2 bg-monster-dark">
                <div className="h-full bg-monster-neon w-[24%] shadow-[0_0_8px_#39ff14]" />
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            variant={isOwned ? "outline" : "primary"}
            className={cn("w-full py-6 text-xl", isOwned && "border-monster-neon bg-monster-neon/10")}
            onClick={() => {
              if (user) { updateCollection(monster.id) } 
              else { alert("Faça login para adicionar à coleção") }
            }}
          >
            {isOwned ? (
              <span className="flex items-center gap-3 text-monster-neon"><Check className="h-6 w-6" /> Lata na sua Coleção</span>
            ) : (
              <span className="flex items-center gap-3"><Plus className="h-6 w-6" /> Adicionar à Minha Coleção</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
