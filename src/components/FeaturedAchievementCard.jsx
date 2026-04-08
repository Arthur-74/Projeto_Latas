import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserAchievements } from "../lib/achievementsApi";
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_COLORS } from "../lib/badgeIcons";
import { hexToRgba } from "../lib/badgeUtils";

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

  const iconColor = featured ? (ACHIEVEMENT_COLORS[featured.name] || "#ffffff") : null;
  const svgIcon = featured ? ACHIEVEMENT_ICONS[featured.name] : null;

  return (
    <Link 
      to={`/u/${username}/achievements`}
      className={`p-6 flex items-center gap-4 clip-diagonal border border-transparent transition-colors group cursor-pointer w-full ${!featured ? 'bg-monster-gray/30 hover:border-monster-neon/50' : 'hover:brightness-110'}`}
      style={{
        ...(featured ? {
          background: hexToRgba(iconColor, 0.05),
          borderLeft: `4px solid ${iconColor}`
        } : {})
      }}
    >
      <div className="shrink-0 flex items-center justify-center w-10 h-10">
        {featured ? (
          svgIcon ? (
            <div className="scale-[1.2]">{svgIcon}</div>
          ) : (
            <span className="text-3xl">{featured.icon}</span>
          )
        ) : (
          <Trophy className="h-10 w-10 text-yellow-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div 
          className="text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ color: featured ? iconColor : "#9ca3af" }}
        >
          {featured ? "Conquista Em Destaque" : "Conquistas"}
        </div>
        {featured ? (
          <div 
            className="text-2xl font-display truncate"
            style={{ color: iconColor }}
          >
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
