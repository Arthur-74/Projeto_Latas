import React from "react";
import { Shield, Target, Trophy } from "lucide-react";
import { achievementsData } from "../../data/achievementsData";
import { getBadgeStyle, BADGE_THRESHOLDS, hexToRgba } from "../../lib/badgeUtils";
import { BADGE_ICONS } from "../../lib/badgeIcons";

export const AdminGamification = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-monster-neon/20 pb-4">
        <div>
          <h1 className="text-4xl font-display text-white uppercase tracking-widest flex items-center gap-3">
             Gamificação <span className="text-yellow-500">CMS</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
            Administração de Badges e Conquistas
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-8 h-8 text-monster-neon" />
          <h2 className="text-2xl font-display text-white uppercase tracking-widest border-l-4 border-monster-neon pl-4">
            Badges de Nível
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* We reverse thresholds so it starts from the lowest level (1) to the highest (10k) */}
          {[...BADGE_THRESHOLDS].reverse().map((badge, idx) => {
            const style = getBadgeStyle(badge.name);
            const icon = BADGE_ICONS[badge.name];
            
            return (
              <div 
                key={badge.name}
                className="bg-monster-gray/30 p-4 flex flex-col justify-center clip-diagonal border border-transparent hover:border-white/20 transition-colors"
                style={{ borderLeft: `4px solid ${style.accent}` }}
              >
                <div className="w-full flex items-center justify-start font-display clip-diagonal"
                  style={{
                    background: hexToRgba(style.accent, 0.05),
                    borderLeft: `4px solid ${style.accent}`,
                    padding: '12px 20px',
                    ...(badge.name === "Monstro" ? { boxShadow: `0 0 0 1px #00ff0033` } : {})
                  }}
                >
                  {icon && (
                    <div className="mr-3 filter drop-shadow-md shrink-0">
                      {icon}
                    </div>
                  )}
                  <div 
                    className="text-2xl"
                    style={{
                      lineHeight: '1',
                      color: style.accent,
                      ...(badge.name === "Monstro" ? { textShadow: `0 0 10px #00ff0088` } : {})
                    }}
                  >
                    {badge.label}
                  </div>
                  <div 
                    className="text-2xl"
                    style={{
                      color: style.accent,
                      marginLeft: '10px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {badge.name}
                  </div>
                </div>
                <div className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  Alcançado ao cadastrar {badge.count} {badge.count === 1 ? 'lata' : 'latas'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-6">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-display text-white uppercase tracking-widest border-l-4 border-yellow-500 pl-4">
            Conquistas do Sistema
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievementsData.map((ach, idx) => (
            <div 
              key={`admin-ach-${ach.id}`}
              className="relative p-6 flex flex-col clip-diagonal border border-white/10 bg-[#1c1c1c] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl filter drop-shadow-lg">{ach.icon || "🏆"}</div>
                {ach.is_secret && (
                  <div className="bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-purple-500/30">
                    Secreta
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-display uppercase text-white mb-2 leading-tight">
                {ach.name}
              </h3>
              
              <p className="text-sm text-gray-400 mb-6 flex-1">
                {ach.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                <span className="text-monster-neon bg-monster-neon/10 px-2 py-1 rounded">+{ach.xp_reward} XP</span>
                <span className="text-gray-500">Regra: {ach.condition_type} ({ach.condition_value})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
