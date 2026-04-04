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
      className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors group cursor-pointer w-full"
    >
      <Trophy className="h-10 w-10 text-yellow-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-monster-neon transition-colors">
          Conquistas
        </div>
        {featured ? (
          <div className="text-2xl font-display text-white truncate">
            {featured.name}
          </div>
        ) : (
          <div className="text-sm font-bold text-gray-500 uppercase truncate">
            Selecione uma conquista
          </div>
        )}
      </div>
    </Link>
  );
};
