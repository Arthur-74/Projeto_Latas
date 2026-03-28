import React from "react";
import { Link } from "react-router-dom";
import { Check, Plus, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

export const CanCard = ({ monster }) => {
  const { user, updateCollection, toggleFavorite } = useAuth();
  
  const isOwned = user?.collection?.includes(monster.id);
  const isFavorited = user?.favorites?.includes(monster.id);

  const handleToggle = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Crie uma conta para colecionar!");
      return;
    }
    const result = updateCollection(monster.id);
    if (result && result.removedFromFavorites) {
      toast("Lata removida da coleção e dos favoritos.");
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    const result = toggleFavorite(monster.id);
    if (result.success) {
      if (result.isAdded) {
        toast.success("❤️ Adicionado aos favoritos!");
      } else {
        toast("Removido dos favoritos.");
      }
    }
  };

  return (
    <Link 
      to={`/catalog/${monster.id}`}
      className={cn(
        "group relative flex flex-col bg-monster-gray/50 border border-white/5 transition-all duration-300 clip-diagonal p-4",
        "hover:scale-[1.04] hover:border-monster-neon/50 hover:bg-monster-gray hover:glow-border",
        isOwned && "border-monster-neon bg-monster-gray/80"
      )}
    >
      <div className="flex-1 flex flex-col h-full">
        {/* Placeholder for Image */}
        <div className="w-full h-48 mb-4 bg-black/40 flex items-center justify-center clip-diagonal relative overflow-hidden">
          {monster.imageUrl ? (
             <img src={monster.imageUrl} alt={monster.name} className="h-full object-contain mix-blend-screen" />
          ) : (
            <div className="text-white/10 flex flex-col items-center justify-center">
              <div className="w-12 h-24 border-2 border-dashed border-white/20 rounded-md"></div>
              <span className="text-xs uppercase mt-2 font-display tracking-widest text-white/30">Sem Foto</span>
            </div>
          )}
          {isOwned && (
            <div className="absolute top-2 right-2 w-8 h-8 bg-monster-neon text-monster-dark rounded-full flex items-center justify-center glow-border animate-in zoom-in">
              <Check className="h-5 w-5 font-bold" />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-display uppercase tracking-wider text-monster-white group-hover:text-monster-neon transition-colors line-clamp-1">
            {monster.name}
          </h3>
          <p className="text-sm text-gray-400 capitalize">{monster.line} • {monster.flavor}</p>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <Badge variant={monster.rarity}>{monster.rarity}</Badge>
          <span className="text-xs text-gray-500">{monster.year} • {monster.country}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 w-full z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant={isOwned ? "outline" : "primary"} 
          className="flex-1"
          onClick={handleToggle}
        >
          {isOwned ? (
             <span className="flex items-center gap-2 text-monster-neon"><Check className="h-4 w-4" /> Tenho Essa</span>
          ) : (
             <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Adicionar</span>
          )}
        </Button>
        {isOwned && (
          <Button
            variant="outline"
            className={cn(
              "px-3 transition-all duration-300",
              isFavorited ? "border-[#cc0000] bg-[#cc0000]/10" : "border-gray-600 hover:border-gray-400"
            )}
            onClick={handleFavorite}
            title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isFavorited 
                  ? "fill-[#cc0000] text-[#cc0000] drop-shadow-[0_0_8px_rgba(204,0,0,0.5)] animate-in zoom-in" 
                  : "text-gray-400"
              )} 
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
