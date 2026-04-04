import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserAchievements } from "../lib/achievementsApi";

export const FeaturedAchievementCard = ({ userId, username, featuredId }) => {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    if (!userId || !featuredId) {
      setFeatured(null);
      return;
    }
    const data = getUserAchievements(userId, "todas");
    const achieve = data.achievements.find(a => a.id === featuredId);
    setFeatured(achieve);
    
    // Listen for updates in real-time
    const handleUpdate = (e) => {
      if (e.detail?.userId === userId) {
        const newData = getUserAchievements(userId, "todas");
        setFeatured(newData.achievements.find(a => a.id === featuredId));
      }
    };

    window.addEventListener("achievements-updated", handleUpdate);
    return () => window.removeEventListener("achievements-updated", handleUpdate);

  }, [userId, featuredId]);

  return (
    <Link 
      to={`/u/${username}/achievements`}
      className="bg-[#1c1c1c] p-6 flex flex-col justify-center clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors group cursor-pointer w-full"
    >
      <div className="flex items-center gap-4 w-full">
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 group-hover:border-yellow-500/50 transition-colors">
          <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-yellow-500 transition-colors">
            Conquistas
          </div>
          {featured ? (
            <div className="text-xl lg:text-2xl font-display text-white uppercase tracking-wider truncate leading-tight drop-shadow-sm">
              {featured.name}
            </div>
          ) : (
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide truncate">
              Selecione uma conquista
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
