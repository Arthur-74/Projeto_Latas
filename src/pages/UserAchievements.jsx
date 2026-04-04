import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAchievements } from "../lib/achievementsApi";
import { Trophy, ArrowLeft, Star, Lock } from "lucide-react";
import toast from "react-hot-toast";

export const UserAchievements = () => {
  const { username } = useParams();
  const { user, setFeaturedAchievement } = useAuth();
  
  const isOwner = user?.username === username;
  const targetUserId = isOwner ? user.id : `mock-${username}`;
  
  const [data, setData] = useState(null);

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

  const handleSelectFeatured = (achieve) => {
    if (!isOwner) return;
    
    if (window.confirm(`Definir "${achieve.name}" como seu destaque no perfil?`)) {
      setFeaturedAchievement(achieve.id);
      toast.success(`${achieve.name} agora está em destaque no seu painel!`, {
        icon: '★',
        style: { background: '#1c1c1c', color: '#ffd700', border: '1px solid #eab308' }
      });
    }
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {unlocked.map((ach, idx) => {
                const isFeatured = ach.id === activeFeaturedId;
                
                return (
                  <div 
                    key={`unlocked-${ach.id}`}
                    onClick={() => handleSelectFeatured(ach)}
                    className={`relative p-6 flex flex-col clip-diagonal border transition-all duration-500 animate-slide-up ${
                      isOwner ? 'cursor-pointer hover:border-yellow-500 hover:scale-[1.02]' : ''
                    } ${
                      isFeatured ? 'border-yellow-500 bg-yellow-500/5' : 'border-white/10 bg-[#1c1c1c]/80'
                    }`}
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center shadow-[0_0_10px_rgba(234,179,8,0.5)] z-10 clip-diagonal-btn">
                        <Star className="w-3 h-3 mr-1 fill-black" /> Em Destaque
                      </div>
                    )}
                    
                    <div className="text-5xl mb-4 filter drop-shadow-lg">{ach.icon}</div>
                    
                    <h3 className="text-xl font-display uppercase text-white mb-2 leading-tight">
                      {ach.name}
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-6 flex-1">
                      {ach.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 text-[10px] font-bold tracking-widest uppercase text-yellow-500">
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
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locked.map((ach, idx) => (
              <div 
                key={`locked-${ach.id}`}
                className="relative p-6 flex flex-col clip-diagonal border border-white/5 bg-[#121212]/50 grayscale opacity-40 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
              >
                <div className="text-5xl mb-4">{ach.icon || "🔒"}</div>
                
                <h3 className="text-xl font-display uppercase text-white mb-2 leading-tight truncate">
                  {ach.name}
                </h3>
                
                <p className="text-sm border-2 border-white/10 text-gray-500 font-display uppercase tracking-widest p-2 text-center mt-2 mb-6">
                  Conquista Bloqueada
                </p>
              </div>
            ))}
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
      `}} />
    </div>
  );
};
