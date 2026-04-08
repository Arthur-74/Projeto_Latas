import React from "react";
import { achievementsData } from "../data/achievementsData";
import toast from "react-hot-toast";

const getStorageKey = (userId) => `monsterVault_achievements_${userId}`;
const DISABLED_KEY = 'monsterVault_disabled_achievements';

export const getDisabledAchievements = () => {
  const data = localStorage.getItem(DISABLED_KEY);
  return data ? JSON.parse(data) : [];
};

export const toggleAchievementStatus = (id) => {
  let disabled = getDisabledAchievements();
  if (disabled.includes(id)) {
    disabled = disabled.filter(d => d !== id);
  } else {
    disabled.push(id);
  }
  localStorage.setItem(DISABLED_KEY, JSON.stringify(disabled));
  
  // Trigger update so users see the achievement disappear/appear in real time
  window.dispatchEvent(new CustomEvent('achievements-updated'));
  return disabled;
};

/**
 * Initializes or fetches a user's achievement data.
 */
const getUserData = (userId) => {
  const data = localStorage.getItem(getStorageKey(userId));
  if (data) return JSON.parse(data);

  return achievementsData.map(a => ({
    achievement_id: a.id,
    progress: 0,
    unlocked_at: null,
  }));
};

/**
 * Saves user data back to local storage
 */
const saveUserData = (userId, data) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
};

/**
 * Get achievements for a specific user, mixed with base achievement info.
 */
export const getUserAchievements = (userId, category = "todas") => {
  const userProgress = getUserData(userId);
  const disabledIds = getDisabledAchievements();
  let xp = 0;
  let unlocked = 0;

  // Filter out disabled achievements before processing user metrics
  const activeAchievementsData = achievementsData.filter(a => !disabledIds.includes(a.id));

  let enrichedAchievements = activeAchievementsData.map((achieve) => {
    const progressRecord = userProgress.find(p => p.achievement_id === achieve.id) || { progress: 0, unlocked_at: null };
    const isUnlocked = !!progressRecord.unlocked_at;
    
    if (isUnlocked) {
      xp += achieve.xp_reward;
      unlocked += 1;
    }

    // Handle Secret
    if (achieve.is_secret && !isUnlocked) {
      return {
        id: achieve.id,
        name: "???",
        description: "Conquista secreta",
        category: achieve.category,
        rarity: achieve.rarity,
        progress: progressRecord.progress,
        total: achieve.condition_value,
        xp_reward: achieve.xp_reward,
        unlocked: false,
        unlocked_at: null
      };
    }

    return {
      id: achieve.id,
      name: achieve.name,
      description: achieve.description,
      icon: achieve.icon,
      category: achieve.category,
      rarity: achieve.rarity,
      progress: progressRecord.progress,
      total: achieve.condition_value,
      xp_reward: achieve.xp_reward,
      unlocked: isUnlocked,
      unlocked_at: progressRecord.unlocked_at
    };
  });

  if (category !== "todas") {
    if (category === "desbloqueadas") {
      enrichedAchievements = enrichedAchievements.filter(a => a.unlocked);
    } else {
      enrichedAchievements = enrichedAchievements.filter(a => a.category === category);
    }
  }

  const level = Math.floor(xp / 1000) + 1;
  const xp_next_level = level * 1000;

  return {
    summary: {
      unlocked,
      total: activeAchievementsData.length,
      xp,
      xp_next_level,
      level
    },
    achievements: enrichedAchievements
  };
};

/**
 * Dynamically synchronize the user's achievements based on their actual current collection.
 * This guarantees proper locking if cans are removed.
 */
export const syncUserAchievements = (user, monstersData) => {
  if (!user || !user.id || !monstersData) return;
  const userProgress = getUserData(user.id);
  
  const userCans = user.collection.map(id => monstersData.find(m => m.id === id)).filter(Boolean);
  
  const stats = {
     total_cans: user.collection.length,
     unique_cans: new Set(user.collection).size, // normally unique but works
     unique_flavors: new Set(userCans.map(c => c.flavor).filter(Boolean)).size,
     countries_count: new Set(userCans.map(c => c.country).filter(Boolean)).size,
     limited_edition: userCans.filter(c => c.edition_type?.toLowerCase().includes("limited")).length,
     ultra_special_cans: userCans.filter(c => c.rarity?.toLowerCase().includes("ultra") || c.name.toLowerCase().includes("ultra")).length,
     no_barcode_cans: userCans.filter(c => c.year < 2010).length,
  };

  let changed = false;
  let newlyUnlocked = [];
  const disabledIds = getDisabledAchievements();

  achievementsData.forEach(achieve => {
    // Skip evaluating if it is disabled by admin
    if (disabledIds.includes(achieve.id)) return;
    
    // Only auto-sync collection-based achievements here
    if (achieve.condition_type in stats) {
       let progressRecord = userProgress.find(p => p.achievement_id === achieve.id);
       if (!progressRecord) {
         progressRecord = { achievement_id: achieve.id, progress: 0, unlocked_at: null };
         userProgress.push(progressRecord);
       }

       const currentValue = stats[achieve.condition_type];
       const displayProgress = Math.min(currentValue, achieve.condition_value);
       
       if (progressRecord.progress !== displayProgress) {
         progressRecord.progress = displayProgress;
         changed = true;
       }

       if (currentValue >= achieve.condition_value) {
         // Is now unlocked
         if (!progressRecord.unlocked_at) {
           progressRecord.unlocked_at = new Date().toISOString();
           changed = true;
           newlyUnlocked.push(achieve);
         }
       } else {
         // Has lost the requirement, lock it
         if (progressRecord.unlocked_at) {
           progressRecord.unlocked_at = null;
           changed = true;
         }
       }
    }
  });

  if (changed) {
    saveUserData(user.id, userProgress);
    window.dispatchEvent(new CustomEvent('achievements-updated', { detail: { userId: user.id } }));
    
    newlyUnlocked.forEach(achieve => {
      toast.success(
         <div className="flex items-center gap-3">
            <span className="text-2xl">{achieve.icon || "🏆"}</span>
            <div>
               <p className="font-bold text-xs uppercase tracking-widest text-[#a0c040]">Conquista Desbloqueada!</p>
               <p className="font-display">{achieve.name}</p>
            </div>
         </div>,
         { duration: 5000, style: { background: '#1a2e0a', color: '#fff', border: '1px solid #a0c040' } }
      );
    });
  }
};

/**
 * Update progress for manual or miscellaneous achievements (like login_streak).
 */
export const updateAchievementProgress = (userId, conditionType, increment = 1) => {
  if (!userId) return;

  const userProgress = getUserData(userId);
  let changed = false;
  let newlyUnlocked = [];
  const disabledIds = getDisabledAchievements();

  // Filter achievements that track this condition and are not disabled
  const relevantAchievements = achievementsData.filter(a => 
      a.condition_type === conditionType && !disabledIds.includes(a.id)
  );

  relevantAchievements.forEach(achieve => {
    let progressRecord = userProgress.find(p => p.achievement_id === achieve.id);
    if (!progressRecord) {
      progressRecord = { achievement_id: achieve.id, progress: 0, unlocked_at: null };
      userProgress.push(progressRecord);
    }

    if (!progressRecord.unlocked_at) {
      // It's still locked
      if (increment === 0 && conditionType === "login_streak") {
         // Special case: break streak
         if (progressRecord.progress !== 0) {
            progressRecord.progress = 0;
            changed = true;
         }
      } else {
         progressRecord.progress += increment;
         changed = true;
         
         if (progressRecord.progress >= achieve.condition_value) {
            // Unlocked!
            progressRecord.progress = achieve.condition_value;
            progressRecord.unlocked_at = new Date().toISOString();
            newlyUnlocked.push(achieve);
         }
      }
    }
  });

  if (changed) {
    saveUserData(userId, userProgress);
    
    // Dispatch an event so components (like the AchievementCard) can re-render
    window.dispatchEvent(new CustomEvent('achievements-updated', { detail: { userId } }));

    // Show toast for newly unlocked
    newlyUnlocked.forEach(achieve => {
      toast.success(
         <div className="flex items-center gap-3">
            <span className="text-2xl">{achieve.icon || "🏆"}</span>
            <div>
               <p className="font-bold text-xs uppercase tracking-widest text-[#a0c040]">Conquista Desbloqueada!</p>
               <p className="font-display">{achieve.name}</p>
            </div>
         </div>,
         { duration: 5000, style: { background: '#1a2e0a', color: '#fff', border: '1px solid #a0c040' } }
      );
    });
  }

  return { changed, newlyUnlocked };
};
