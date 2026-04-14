import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Check, Plus, Heart, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export const CanDetail = () => {
  const { id } = useParams();
  const { getItemById, getItemImages } = useAppData();
  const { user, updateCollection, toggleFavorite } = useAuth();
  
  const monster = getItemById(id);
  const images = monster ? getItemImages(monster.id) : [];
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!monster) {
    return <div className="p-24 text-center text-white">Lata não encontrada no Catálogo Atual</div>;
  }

  // Pre-sort images: principal always comes first if exists
  const sortedImages = [...images].sort((a,b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
  const activeImage = sortedImages[activeImageIdx];

  const isOwned = user?.collection?.includes(monster.id);
  const isFavorited = user?.favorites?.includes(monster.id);

  const handleToggle = () => {
    if (!user) {
      alert("Faça login para adicionar à coleção");
      return;
    }
    const result = updateCollection(monster.id);
    if (result && result.removedFromFavorites) {
      toast("Lata removida da coleção e dos favoritos.");
    }
  };

  const handleFavorite = () => {
    if (!user) return;
    const result = toggleFavorite(monster.id);
    if (result.success) {
      if (result.isAdded) {
        toast.custom((t) => (
          <div className={`flex items-center gap-4 bg-[#121212] border-2 border-[#cc0000] p-4 shadow-[0_0_15px_rgba(204,0,0,0.2)] clip-diagonal animate-in fade-in zoom-in duration-300`}>
             <div className="shrink-0 w-12 h-12 bg-[#cc0000]/20 flex items-center justify-center clip-diagonal">
                <Heart className="w-6 h-6 text-[#cc0000] drop-shadow-[0_0_8px_rgba(204,0,0,0.8)] fill-[#cc0000]" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-[#cc0000] uppercase tracking-widest leading-none mb-1">FAVORITA</p>
                <p className="font-sans font-bold text-sm text-gray-300">Adicionada aos favoritos!</p>
             </div>
          </div>
        ), { duration: 3000 });
      } else {
        toast.custom((t) => (
          <div className={`flex items-center gap-4 bg-[#121212] border border-gray-600 p-4 shadow-xl clip-diagonal animate-in fade-in zoom-in duration-300`}>
             <div className="shrink-0 w-12 h-12 bg-gray-800 flex items-center justify-center clip-diagonal">
                <Heart className="w-6 h-6 text-gray-400" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">REMOVIDA</p>
                <p className="font-sans font-bold text-sm text-gray-400">Removida dos favoritos.</p>
             </div>
          </div>
        ), { duration: 3000 });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center text-gray-400 hover:text-monster-neon mb-8 font-bold tracking-widest text-sm uppercase transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Catálogo
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Imagem Area (Left) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
           {/* Principal Image Box */}
           <div className="w-full flex items-center justify-center p-12 bg-monster-gray/50 clip-diagonal relative glow-border h-[500px]">
              <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
              <div className="absolute inset-0 bg-monster-neon/5 opacity-[0.02] pointer-events-none mix-blend-overlay" />
              {activeImage ? (
                 <img key={activeImage.id} src={activeImage.url} alt={monster.name} className="h-full object-contain z-10 drop-shadow-[0_20px_50px_rgba(57,255,20,0.2)] animate-in fade-in zoom-in duration-300 mix-blend-screen" />
              ) : (
                <div className="text-white/20 flex flex-col items-center justify-center z-10">
                  <div className="w-32 h-64 border-2 border-dashed border-white/20 rounded-xl" />
                  <span className="text-lg uppercase mt-4 font-display tracking-widest text-white/30">Sem Imagens</span>
                </div>
              )}
           </div>

           {/* Thumbnails Gallery */}
           {sortedImages.length > 1 && (
             <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 pt-2">
                {sortedImages.map((img, idx) => (
                   <button 
                      key={img.id}
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "w-20 h-28 shrink-0 bg-black/50 border flex items-center justify-center clip-diagonal p-1 transition-all overflow-hidden relative",
                        idx === activeImageIdx ? "border-monster-neon opacity-100 glow-border" : "border-white/10 opacity-50 hover:opacity-80"
                      )}
                   >
                      <img src={img.url} className="h-full object-contain mix-blend-screen" alt="thumbnail" />
                      {img.principal && (
                        <div className="absolute top-0 right-0 bg-monster-neon h-2 w-2" title="Imagem Principal" />
                      )}
                   </button>
                ))}
             </div>
           )}
        </div>

        {/* Info (Right) */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <Badge variant={monster.rarity}>{monster.rarity}</Badge>
              <span className="text-sm font-bold tracking-widest text-gray-400 uppercase bg-black/40 px-3 py-1 border border-white/5">{monster.year}</span>
              <span className="text-sm font-bold tracking-widest text-gray-400 uppercase bg-black/40 px-3 py-1 border border-white/5">{monster.country}</span>
              <span className="text-sm font-bold tracking-widest text-monster-neon uppercase bg-monster-neon/10 px-3 py-1 border border-monster-neon/30">{monster.volume_ml}ml</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display uppercase tracking-widest text-white mb-2">
              {monster.name}
            </h1>
            <p className="text-xl text-monster-neon font-display tracking-widest uppercase mb-4">
              {monster.line} {monster.flavor && `// ${monster.flavor}`}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-white/10 py-6">
             <div className="bg-black/20 p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Design / Variável</p>
                <p className="text-sm text-white font-body truncate">{monster.design || "Padronizado"}</p>
             </div>
             <div className="bg-black/20 p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Lote</p>
                <p className="text-sm text-white font-body truncate">{monster.lote || "Não documentado"}</p>
             </div>
             <div className="bg-black/20 p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Idioma Embalagem</p>
                <p className="text-sm text-white font-body truncate">{monster.idioma || "ND"}</p>
             </div>
             <div className="bg-black/20 p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Identificador</p>
                <p className="text-xs text-gray-500 truncate" title={monster.slug}>{monster.id}</p>
             </div>
          </div>

          <div className="p-6 bg-monster-dark border-l-4 border-monster-neon text-gray-300 leading-relaxed font-body text-lg">
            {monster.description || "Nenhuma nota descritiva ou curiosidade registrada para esta variante."}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            <Button 
              size="lg" 
              variant={isOwned ? "outline" : "primary"}
              className={cn("flex-1 py-6 text-xl", isOwned && "border-monster-neon bg-monster-neon/10")}
              onClick={handleToggle}
            >
              {isOwned ? (
                <span className="flex items-center gap-3 text-monster-neon"><Check className="h-6 w-6" /> Lata na sua Coleção</span>
              ) : (
                <span className="flex items-center gap-3"><Plus className="h-6 w-6" /> Adicionar à Minha Coleção</span>
              )}
            </Button>

            {isOwned && (
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "py-6 px-6 transition-all duration-300",
                  isFavorited ? "border-[#cc0000] bg-[#cc0000]/10" : "border-gray-600 hover:border-gray-400"
                )}
                onClick={handleFavorite}
                title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart 
                  className={cn(
                    "h-8 w-8 transition-all duration-300",
                    isFavorited 
                      ? "fill-[#cc0000] text-[#cc0000] drop-shadow-[0_0_12px_rgba(204,0,0,0.6)] animate-in zoom-in" 
                      : "text-gray-400"
                  )} 
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
