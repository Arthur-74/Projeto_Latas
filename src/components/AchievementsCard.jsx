import React, { useState, useEffect } from "react";
import { getUserAchievements } from "../lib/achievementsApi";
import { Trophy, Lock } from "lucide-react";

const RARITY_COLORS = {
  comum: { bg: "#1a2e0a", text: "#a0c040", progress: "#C8F026" },
  raro: { bg: "#0d1e3a", text: "#5eaaee", progress: "#378ADD" },
  epico: { bg: "#1a0e30", text: "#a087ee", progress: "#7F77DD" },
  lendario: { bg: "#2e1800", text: "#f5a623", progress: "#EF9F27" }
};

export const AchievementsCard = ({ userId, isOwner }) => {
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("todas");

  const fetchData = () => {
    if (!userId) return;
    const result = getUserAchievements(userId, category);
    setData(result);
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = (e) => {
      if (e.detail?.userId === userId) {
        fetchData();
      }
    };

    window.addEventListener("achievements-updated", handleUpdate);
    return () => window.removeEventListener("achievements-updated", handleUpdate);
  }, [userId, category]);

  if (!data) return null;

  const { summary, achievements } = data;

  // XP Progress Bar variables
  const currentLevelMinXp = (summary.level - 1) * 1000;
  const levelXpProgress = summary.xp - currentLevelMinXp;
  const levelXpTotal = 1000;
  const levelXpPercent = Math.min(100, Math.round((levelXpProgress / levelXpTotal) * 100));

  const tabs = [
    { id: "todas", label: "Todas" },
    { id: "colecao", label: "Coleção" },
    { id: "raridade", label: "Raridade" },
    { id: "social", label: "Social" },
    { id: "desbloqueadas", label: "✓ Desbloq." }
  ];

  return (
    <div className="w-full bg-monster-dark/80 border border-monster-neon/20 p-6 clip-diagonal relative glow-border overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 text-monster-neon/5 opacity-50 pointer-events-none">
        <Trophy className="w-64 h-64" />
      </div>

      <div className="relative z-10 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-monster-neon/10 rounded-lg">
              <Trophy className="w-8 h-8 text-monster-neon" />
            </div>
            <div>
              <h2 className="text-2xl font-display text-white uppercase tracking-widest">Conquistas</h2>
              <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                {summary.unlocked} de {summary.total} Desbloqueadas
              </p>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-monster-neon">Nível {summary.level}</span>
              <span className="text-white">{summary.xp} / {summary.xp_next_level} XP</span>
            </div>
            <div className="h-2 w-full bg-black border border-white/10 rounded overflow-hidden">
              <div 
                className="h-full bg-monster-neon transition-all duration-1000" 
                style={{ width: `${levelXpPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                category === tab.id 
                  ? "bg-monster-neon text-black" 
                  : "bg-monster-gray/50 text-gray-400 hover:bg-monster-neon/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
             const style = RARITY_COLORS[ach.rarity] || RARITY_COLORS.comum;
             const isHidden = !isOwner && !ach.unlocked; // Hide numeric progress for non-owner if locked
             const progressPercent = Math.min(100, Math.round((ach.progress / ach.total) * 100));

             return (
               <div 
                 key={ach.id} 
                 className={`relative flex flex-col p-4 border transition-all ${
                   ach.unlocked 
                     ? "border-monster-neon/30 hover:border-monster-neon"
                     : "border-white/5 opacity-70 grayscale hover:grayscale-0"
                 }`}
                 style={{ backgroundColor: ach.unlocked ? style.bg : "rgba(30,30,30,0.5)" }}
                 aria-disabled={!ach.unlocked}
               >
                 {/* Top Row: Icon + Name */}
                 <div className="flex items-start gap-3 mb-2">
                    <div className="text-3xl filter drop-shadow-md shrink-0">
                       {ach.unlocked || ach.name !== "???" ? ach.icon : "🔒"}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="font-display uppercase text-white truncate text-sm">
                         {ach.name}
                       </h3>
                       <span 
                         className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm inline-block mt-0.5"
                         style={{ backgroundColor: `${style.bg}80`, color: style.text, border: `1px solid ${style.text}40` }}
                       >
                         {ach.rarity}
                         {!ach.unlocked && isOwner && <Lock className="inline w-3 h-3 ml-1 -translate-y-0.5" />}
                       </span>
                    </div>
                 </div>

                 {/* Description */}
                 <p className="text-xs text-gray-400 mb-4 flex-1">
                    {ach.description}
                 </p>

                 {/* Progress Area */}
                 <div className="mt-auto">
                    {ach.unlocked ? (
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#a0c040]">
                        <span>✓ Concluída</span>
                        <span>+{ach.xp_reward} XP</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {isOwner ? (
                          <>
                            <div className="flex justify-between text-[10px] uppercase text-gray-500 font-bold">
                               <span>Progresso</span>
                               <span>{ach.progress} / {ach.total}</span>
                            </div>
                            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden" role="progressbar" aria-valuenow={ach.progress} aria-valuemax={ach.total}>
                               <div 
                                 className="h-full transition-all duration-700"
                                 style={{ width: `${progressPercent}%`, backgroundColor: style.progress }}
                               />
                            </div>
                          </>
                        ) : (
                          <div className="text-[10px] uppercase text-gray-600 font-bold tracking-widest text-center mt-2 border-t border-white/5 pt-2">
                            Bloqueado
                          </div>
                        )}
                      </div>
                    )}
                 </div>
               </div>
             );
          })}
        </div>
        
        {achievements.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-display uppercase tracking-widest">
            Nenhuma conquista encontrada.
          </div>
        )}
      </div>
    </div>
  );
};
