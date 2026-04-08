import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAchievements } from "../lib/achievementsApi";
import { Trophy, ArrowLeft, Star, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_COLORS } from "../lib/badgeIcons";
import { hexToRgba } from "../lib/badgeUtils";

export const UserAchievements = () => {
  const { username } = useParams();
  const { user, setFeaturedAchievement } = useAuth();
  
  const isOwner = user?.username === username;
  const targetUserId = isOwner ? user.id : `mock-${username}`;
  
  const [data, setData] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const result = getUserAchievements(targetUserId, "todas");
      setData(result);
    };

    fetchData();

    const handleUpdate = (e) => {
      if (e.detail?.userId === targetUserId) fetchData();
    };

    window.addEventListener("achievements-updated", handleUpdate);
    return () => window.removeEventListener("achievements-updated", handleUpdate);
  }, [targetUserId]);

  if (!data) return null;

  const unlocked = data.achievements.filter(a => a.unlocked);
  const locked = data.achievements.filter(a => !a.unlocked);

  const handleToggleFeatured = (achieve, isCurrentlyFeatured) => {
    if (!isOwner) return;
    setConfirmModalData({ achieve, isRemoving: isCurrentlyFeatured });
  };

  const confirmToggle = () => {
    if (!confirmModalData) return;
    const { achieve, isRemoving } = confirmModalData;
    
    if (isRemoving) {
      setFeaturedAchievement(null);
      toast.success(`Destaque removido com sucesso!`, {
          style: { background: '#1c1c1c', color: '#fff', border: '1px solid #333' }
      });
    } else {
      setFeaturedAchievement(achieve.id);
      toast.success(`${achieve.name} agora está em destaque no seu painel!`, {
          icon: '★',
          style: { background: '#1c1c1c', color: '#ffd700', border: '1px solid #eab308' }
      });
    }
    setConfirmModalData(null);
  };

  const currentFeaturedId = isOwner ? user?.featured_achievement_id : null; // For visitors we would mock it, but we don't care to show ★ for visitors if not saved in a real DB. Let's just assume no featured icon for mocked profiles for now or use 'a-first-blood'.
  
  // For visual mockup of other profiles, let's keep the featured star matching what Profile showed
  const activeFeaturedId = isOwner ? currentFeaturedId : "a-first-blood";

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0a0a0a] min-h-screen pb-24">
      {/* Header */}
      <div className="container mx-auto px-4 pt-12 pb-8 border-b border-white/5 relative">
        <Link 
          to={`/u/${username}`} 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-monster-neon uppercase tracking-widest transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao perfil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display text-white uppercase tracking-wider mb-2">
          Conquistas
        </h1>
        <div className="text-xl text-monster-neon font-display tracking-widest uppercase">
          @{username}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col space-y-16">
        
        {/* Unlocked Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-display text-white uppercase tracking-widest border-l-4 border-yellow-500 pl-4">
              Desbloqueadas
            </h2>
          </div>
          
          {unlocked.length === 0 ? (
            <div className="text-gray-500 font-display uppercase tracking-widest p-8 border border-white/5 text-center">
              Nenhuma conquista desbloqueada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unlocked.map((ach, idx) => {
                const isFeatured = ach.id === activeFeaturedId;
                const iconColor = ACHIEVEMENT_COLORS[ach.name] || "#ffffff";
                const svgIcon = ACHIEVEMENT_ICONS[ach.name];
                
                return (
                  <div 
                    key={`unlocked-${ach.id}`}
                    className={`group relative p-6 flex flex-col justify-between clip-diagonal border-t border-r border-b transition-all duration-500 animate-slide-up ${
                      isOwner ? 'hover:scale-[1.02]' : ''
                    }`}
                    style={{ 
                      animationDelay: `${idx * 100}ms`, 
                      animationFillMode: "both",
                      borderLeft: `4px solid ${iconColor}`,
                      borderTopColor: isFeatured ? iconColor : 'transparent',
                      borderRightColor: isFeatured ? iconColor : 'transparent',
                      borderBottomColor: isFeatured ? iconColor : 'transparent',
                      background: isFeatured ? hexToRgba(iconColor, 0.15) : hexToRgba(iconColor, 0.05)
                    }}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 mt-[5px] mr-[5px] bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center shadow-[0_0_10px_rgba(234,179,8,0.5)] z-10 clip-diagonal-btn">
                        <Star className="w-3 h-3 mr-1 fill-black" /> Em Destaque
                      </div>
                    )}

                    {isOwner && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(ach, isFeatured);
                          }}
                          className={`px-4 py-2 text-[11px] uppercase font-bold tracking-widest border transition-all ${
                             isFeatured 
                             ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/40 hover:scale-105 clip-diagonal-btn'
                             : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/40 hover:scale-105 clip-diagonal-btn'
                          }`}
                        >
                          {isFeatured ? 'Remover Destaque' : 'Adicionar ao Destaque'}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <div className="shrink-0 flex items-center justify-center w-10 h-10">
                        <div className="scale-[1.2] filter drop-shadow-md">
                          {svgIcon ? svgIcon : <span className="text-3xl">{ach.icon}</span>}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div 
                          className="text-xs font-bold uppercase tracking-widest transition-colors"
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
                    
                    <p className="pt-0 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                      {ach.description}
                    </p>
                    
                    <div className="mt-auto pt-2 pb-2 border-t border-white/5 text-[10px] font-bold tracking-widest uppercase text-yellow-500">
                      Desbloqueada em {new Date(ach.unlocked_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Locked Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Lock className="w-8 h-8 text-gray-600" />
            <h2 className="text-3xl font-display text-gray-600 uppercase tracking-widest border-l-4 border-gray-600 pl-4">
              Bloqueadas
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {locked.map((ach, idx) => {
              const svgIcon = ACHIEVEMENT_ICONS[ach.name];
              
              return (
              <div 
                key={`locked-${ach.id}`}
                className="relative p-6 flex flex-col justify-between clip-diagonal border-l-4 border border-white/5 bg-[#121212]/50 grayscale opacity-40 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both", borderLeftColor: "#666" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10">
                    <div className="scale-[1.2] filter drop-shadow-md">
                      {svgIcon ? svgIcon : <span className="text-3xl">{ach.icon || "🔒"}</span>}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#666]">
                      Bloqueada
                    </div>
                    <div className="text-2xl font-display truncate flex items-baseline gap-2 text-white">
                      <span className="uppercase truncate">{ach.name}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] font-bold border border-white/10 text-gray-500 uppercase tracking-widest p-2 text-center mt-auto mb-2 bg-white/5 clip-diagonal-btn">
                  Conquista Oculta
                </p>
              </div>
              );
            })}
          </div>
        </section>

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}} />

      {/* Custom Confirm Modal */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1c1c] max-w-md w-full clip-diagonal border-l-4 p-8 relative shadow-2xl"
               style={{ borderLeftColor: confirmModalData.isRemoving ? '#ef4444' : '#eab308' }}
          >
            <h3 className="text-3xl font-display text-white uppercase tracking-widest mb-4">
              {confirmModalData.isRemoving ? 'Remover Destaque?' : 'Destacar Conquista?'}
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              {confirmModalData.isRemoving 
                ? `Remover "${confirmModalData.achieve.name}" da vitrine principal do seu perfil e dashboard?`
                : `Deseja exibir orgulhosamente "${confirmModalData.achieve.name}" como sua conquista principal do perfil?`}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModalData(null)}
                className="px-6 py-2 text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmToggle}
                className={`px-6 py-2 text-sm font-bold uppercase tracking-widest clip-diagonal-btn transition-colors ${
                  confirmModalData.isRemoving
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                  : 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {confirmModalData.isRemoving ? 'Sim, Remover' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
