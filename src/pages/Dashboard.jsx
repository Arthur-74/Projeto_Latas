import React from "react";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Link, Navigate } from "react-router-dom";
import { CanCard } from "../components/CanCard";
import { Trophy, Flame, Zap } from "lucide-react";
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header Info */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-monster-gray/40 border border-monster-neon/30 p-8 clip-diagonal relative glow-border">
        <div className="w-32 h-32 rounded-full border-4 border-monster-neon bg-monster-dark flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-4xl font-display text-monster-neon object-cover">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-display tracking-widest uppercase text-white">
            {user.username}
          </h1>
          <p className="text-monster-neon font-bold tracking-widest uppercase text-sm">
            Membro desde {user.memberSince} • Latas Totais: {user.collection.length}
          </p>
        </div>
        
        <div className="w-full md:w-64">
           <div className="flex justify-between items-end mb-2 font-display uppercase tracking-widest">
             <span className="text-gray-400">Progresso</span>
             <span className="text-2xl text-monster-neon glow-text">
               {userCanCount > 0 && badgeInfo ? `${userCanCount} · ${badgeInfo.name}` : "0 latas"}
             </span>
           </div>
           <div className="h-3 w-full bg-monster-dark border border-white/10">
             <div className="h-full bg-monster-neon transition-all duration-1000" style={{ width: `${progressBarWidth}%` }}/>
           </div>
        </div>
      </section>

      {/* Metrics & Trophies Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Flame className="h-10 w-10 text-monster-red" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Raridade Média</div>
            <div className="text-2xl font-display text-white">Raro</div>
          </div>
        </div>
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Zap className="h-10 w-10 text-monster-neon" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Latas Faltantes</div>
            <div className="text-2xl font-display text-white">{monsters.length - user.collection.length}</div>
          </div>
        </div>

        {/* Badge Card */}
        <div 
          className="bg-monster-gray/30 p-6 flex flex-col justify-center clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors"
          style={{ borderLeft: badgeStyle ? `4px solid ${badgeStyle.accent}` : '4px solid transparent' }}
        >
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Badge Atual</div>
          {userCanCount > 0 && badgeInfo && badgeStyle ? (
            <div 
              className="w-full flex items-center justify-start font-display clip-diagonal"
              style={{
                background: hexToRgba(badgeStyle.accent, 0.05),
                borderLeft: `4px solid ${badgeStyle.accent}`,
                padding: '12px 20px',
                ...(badgeInfo.name === "Monstro" ? {
                  boxShadow: `0 0 0 1px #00ff0033`
                } : {})
              }}
            >
              {BADGE_ICONS[badgeInfo.name] && (
                <div className="mr-3 filter drop-shadow-md shrink-0">
                  {BADGE_ICONS[badgeInfo.name]}
                </div>
              )}
              <div 
                className="text-2xl"
                style={{
                  lineHeight: '1',
                  color: badgeStyle.accent,
                  ...(badgeInfo.name === "Monstro" ? {
                    textShadow: `0 0 10px #00ff0088`
                  } : {})
                }}
              >
                {badgeInfo.label}
              </div>
              <div 
                className="text-2xl"
                style={{
                  color: badgeStyle.accent,
                  marginLeft: '10px',
                  textTransform: 'uppercase'
                }}
              >
                {badgeInfo.name}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-display text-white">Nenhum</div>
          )}
        </div>
        
        {/* Featured Achievement Card */}
        <FeaturedAchievementCard 
          userId={user.id} 
          username={user.username} 
          featuredId={user.featured_achievement_id} 
        />
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
