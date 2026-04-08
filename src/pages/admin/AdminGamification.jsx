import React from "react";
import { Shield, Target, Trophy } from "lucide-react";
import { achievementsData } from "../../data/achievementsData";
import { getBadgeStyle, BADGE_THRESHOLDS, hexToRgba } from "../../lib/badgeUtils";
import { BADGE_ICONS, ACHIEVEMENT_ICONS, ACHIEVEMENT_COLORS } from "../../lib/badgeIcons";

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* We reverse thresholds so it starts from the lowest level (1) to the highest (10k) */}
          {[...BADGE_THRESHOLDS].reverse().map((badge, idx) => {
            const style = getBadgeStyle(badge.name);
            const icon = BADGE_ICONS[badge.name];
            
            return (
              <div 
                key={badge.name}
                className="p-6 flex flex-col justify-between clip-diagonal border border-transparent hover:brightness-110 transition-all"
                style={{ 
                  background: hexToRgba(style.accent, 0.05),
                  borderLeft: `4px solid ${style.accent}`,
                  ...(badge.name === "Monstro" ? { boxShadow: `0 0 0 1px #00ff0033` } : {})
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10">
                    <div className="scale-[1.2] filter drop-shadow-md">
                      {icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div 
                      className="text-xs font-bold uppercase tracking-widest transition-colors"
                      style={{ color: style.accent }}
                    >
                      Badge
                    </div>
                    <div 
                      className="text-2xl font-display truncate flex items-baseline gap-2"
                      style={{
                        color: style.accent,
                        ...(badge.name === "Monstro" ? { textShadow: `0 0 10px #00ff0088` } : {})
                      }}
                    >
                      <span>{badge.label}</span>
                      <span className="uppercase">{badge.name}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {achievementsData.map((ach, idx) => {
            const iconColor = ACHIEVEMENT_COLORS[ach.name] || "#ffffff";
            const svgIcon = ACHIEVEMENT_ICONS[ach.name];

            return (
            <div 
              key={`admin-ach-${ach.id}`}
              className="relative p-6 flex flex-col clip-diagonal border-t border-r border-b transition-all"
              style={{
                borderLeft: `4px solid ${iconColor}`,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                background: hexToRgba(iconColor, 0.05)
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="shrink-0 flex items-center justify-center w-10 h-10">
                  <div className="scale-[1.2] filter drop-shadow-md">
                    {svgIcon ? svgIcon : <span className="text-3xl">{ach.icon || "🏆"}</span>}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center relative">
                  {ach.is_secret && (
                    <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-purple-500/30">
                      Secreta
                    </div>
                  )}
                  <div 
                    className="text-xs font-bold uppercase tracking-widest transition-colors pr-16"
                    style={{ color: iconColor }}
                  >
                    Conquista
                  </div>
                  <div 
                    className="text-2xl font-display truncate flex items-baseline gap-2"
                    style={{ color: iconColor }}
                  >
                    <span className="uppercase">{ach.name}</span>
                  </div>
                </div>
              </div>
              
              <p className="pt-0 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                {ach.description}
              </p>
              
              <div className="mt-auto pt-4 pb-2 border-t border-white/5 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                <span className="text-monster-neon bg-monster-neon/10 px-2 py-1 rounded">+{ach.xp_reward} XP</span>
                <span className="text-gray-500">Regra: {ach.condition_type} ({ach.condition_value})</span>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
