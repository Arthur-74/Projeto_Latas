import React from "react";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Link, Navigate } from "react-router-dom";
import { CanCard } from "../components/CanCard";
import { Trophy, Flame, Zap, BadgeCheck, Shield } from "lucide-react";
import { FeaturedAchievementCard } from "../components/FeaturedAchievementCard";
import { getBadgeInfo, getBadgeStyle, hexToRgba } from "../lib/badgeUtils";
import { BADGE_ICONS } from "../lib/badgeIcons";

const ENABLE_NEW_ACHIEVEMENTS = true;

export const Dashboard = () => {
  const { user } = useAuth();
  const { monsters, getUserPercentage, getMissingCans } = useAppData();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userCanCount = user.collection.length;
  const badgeInfo = getBadgeInfo(userCanCount);
  const badgeStyle = badgeInfo ? getBadgeStyle(badgeInfo.name) : null;
  const progressBarWidth = Math.min((userCanCount / 500) * 100, 100);
  const missingCans = getMissingCans(user.collection).slice(0, 4); // Show 4 suggestions

  const ownedCans = user.collection.map(id => monsters.find(m => m.id === id)).filter(Boolean);
  const latestCans = [...ownedCans].reverse().slice(0, 4);

  const calculateAverageRarity = () => {
    if (ownedCans.length === 0) return "Nenhuma";
    
    const rarityWeights = {
      "Comum": 1,
      "Raro": 2,
      "Ultra Raro": 3,
      "Edição Limitada": 4,
      "Exclusivo Regional": 5
    };
    
    const reverseWeights = {
      1: "Comum",
      2: "Raro",
      3: "Ultra Raro",
      4: "Ed. Limitada",
      5: "Regional"
    };

    const totalWeight = ownedCans.reduce((sum, can) => {
      return sum + (rarityWeights[can.rarity] || 1);
    }, 0);

    const average = Math.round(totalWeight / ownedCans.length);
    return reverseWeights[average] || "Comum";
  };
  
  const averageRarity = calculateAverageRarity();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header Info */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-monster-gray/40 border border-monster-neon/30 p-8 clip-diagonal relative glow-border">
        <div className="w-32 h-32 rounded-full border-4 border-monster-neon bg-monster-dark flex items-center justify-center glow-border shadow-2xl relative shrink-0">
             {user.avatarUrl ? (
               <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
             ) : (
               <span className="text-4xl font-display text-monster-neon object-cover">{(user.displayName || user.username).charAt(0).toUpperCase()}</span>
             )}
             
             {/* Badge Admin */}
             <div className="absolute bottom-1 right-1 flex gap-1 z-20">
               {user?.isVerified && (
                 <div className="text-white rounded-full shadow-lg" title="Conta Verificada">
                   <BadgeCheck className="h-7 w-7 fill-sky-500 text-white" />
                 </div>
               )}
               {user?.role === "admin" && (
                 <div className="bg-monster-neon text-monster-dark p-1 rounded-full shadow-lg" title="Administrador">
                   <Shield className="h-5 w-5" />
                 </div>
               )}
             </div>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-display tracking-widest uppercase text-white">
            {user.displayName || user.username}
          </h1>
          <p className="text-monster-neon font-bold tracking-widest uppercase text-sm">
            Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : "15/01/2024"}
          </p>
        </div>
      </section>

      {/* Metrics & Trophies Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Featured Achievement Card */}
        <FeaturedAchievementCard 
          userId={user.id} 
          username={user.username} 
          featuredId={user.featured_achievement_id} 
        />
        
        {/* Badge Card */}
        <div 
          className={`p-6 flex items-center gap-4 clip-diagonal border border-transparent transition-colors w-full ${!badgeInfo ? 'bg-monster-gray/30 hover:border-monster-neon/50' : 'hover:brightness-110'}`}
          style={{
            ...(badgeInfo && badgeStyle ? {
              background: hexToRgba(badgeStyle.accent, 0.05),
              borderLeft: `4px solid ${badgeStyle.accent}`,
              ...(badgeInfo.name === "Monstro" ? { boxShadow: `0 0 0 1px #00ff0033` } : {})
            } : {})
          }}
        >
          <div className="shrink-0 flex items-center justify-center w-10 h-10">
            {badgeInfo && badgeStyle ? (
              <div className="scale-[1.2] filter drop-shadow-md">
                {BADGE_ICONS[badgeInfo.name]}
              </div>
            ) : (
              <Trophy className="h-10 w-10 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div 
              className="text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ color: badgeStyle ? badgeStyle.accent : "#9ca3af" }}
            >
              Badge Atual
            </div>
            {userCanCount > 0 && badgeInfo && badgeStyle ? (
              <div 
                className="text-2xl font-display truncate flex items-baseline gap-2"
                style={{
                  color: badgeStyle.accent,
                  ...(badgeInfo.name === "Monstro" ? { textShadow: `0 0 10px #00ff0088` } : {})
                }}
              >
                <span>{badgeInfo.label}</span>
                <span className="uppercase">{badgeInfo.name}</span>
              </div>
            ) : (
              <div className="text-2xl font-display text-white mt-1">Nenhum</div>
            )}
          </div>
        </div>

        {/* Raridade Média */}
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Flame className="h-10 w-10 text-monster-red" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Raridade Média</div>
            <div className="text-xl font-display text-white">{averageRarity}</div>
          </div>
        </div>

        {/* Latas Totais */}
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Zap className="h-10 w-10 text-monster-neon" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Latas Totais</div>
            <div className="text-2xl font-display text-white">{user.collection.length}</div>
          </div>
        </div>
      </section>

      {/* Last Added */}
      {latestCans.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-display text-monster-white tracking-widest uppercase border-b border-monster-neon pb-2 inline-block">
               Adicionadas Recentemente
             </h2>
             <Link to="/catalog" className="text-sm font-bold text-monster-neon hover:text-white uppercase tracking-widest transition-colors mb-2">Ver Coleção</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {latestCans.map(can => (
               <CanCard key={`latest-${can.id}`} monster={can} />
             ))}
          </div>
        </section>
      )}

      {/* Suggested Missing */}
      {missingCans.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-display text-monster-white tracking-widest uppercase border-b border-monster-neon pb-2 inline-block">
               Sugestões: O Que Falta
             </h2>
             <Link to="/catalog" className="text-sm font-bold text-monster-neon hover:text-white uppercase tracking-widest transition-colors mb-2">Explorar Tudo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {missingCans.map(can => (
               <CanCard key={`missing-${can.id}`} monster={can} />
             ))}
          </div>
        </section>
      )}
    </div>
  );
};
