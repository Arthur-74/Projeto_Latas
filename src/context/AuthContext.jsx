import React, { createContext, useContext, useState, useEffect } from "react";
import { updateAchievementProgress } from "../lib/achievementsApi";
import { monstersData } from "../data/monsters";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user session check
    const storedUser = localStorage.getItem("monsterVault_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = email === "admin@monster.com" ? "admin" : "user";
        
        const mockUser = {
          id: email === "admin@monster.com" ? "u-admin" : "u-1234",
          username: email === "admin@monster.com" ? "Vault_Admin" : "monster_collector",
          email,
          role,
          avatarUrl: "",
          memberSince: "2024",
          collection: ["m-original-green", "m-ultra-white", "m-mango-loco", "m-ultra-fiesta", "m-reserve-watermelon"],
          favorites: ["m-original-green", "m-mango-loco"]
        };
        setUser(mockUser);
        localStorage.setItem("monsterVault_user", JSON.stringify(mockUser));
        
        // Triggers achievements on login
        if (mockUser.id) {
          updateAchievementProgress(mockUser.id, "login_streak", 1);
        }
        
        resolve({ success: true, user: mockUser });
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("monsterVault_user");
  };

  const updateCollection = (canId) => {
    if (!user) return { removedFromFavorites: false };
    
    let result = { removedFromFavorites: false };
    
    setUser(prev => {
      let newCollection = prev.collection;
      const isOwned = prev.collection.includes(canId);
      
      if (isOwned) {
        newCollection = prev.collection.filter(id => id !== canId);
      } else {
        newCollection = [...prev.collection, canId];
        
        // Gamification Triggers
        const monster = monstersData.find(m => m.id === canId);
        if (monster) {
           updateAchievementProgress(prev.id, "total_cans", 1);
           updateAchievementProgress(prev.id, "unique_cans", 1);
           
           const hasFlavor = prev.collection.some(id => monstersData.find(m => m.id === id)?.flavor === monster.flavor);
           if (!hasFlavor) updateAchievementProgress(prev.id, "unique_flavors", 1);
           
           const hasCountry = prev.collection.some(id => monstersData.find(m => m.id === id)?.country === monster.country);
           if (!hasCountry) updateAchievementProgress(prev.id, "countries_count", 1);
           
           if (monster.edition_type && monster.edition_type.toLowerCase().includes("limited")) {
              updateAchievementProgress(prev.id, "limited_edition", 1);
           }
           if (monster.rarity && monster.rarity.toLowerCase().includes("ultra")) {
              updateAchievementProgress(prev.id, "ultra_special_cans", 1);
           }
           // simulate no barcode for testing if year is old
           if (monster.year < 2010) {
              updateAchievementProgress(prev.id, "no_barcode_cans", 1);
           }
        }
      }
        
      let newFavorites = prev.favorites || [];
      if (isOwned && newFavorites.includes(canId)) {
        newFavorites = newFavorites.filter(id => id !== canId);
        result.removedFromFavorites = true;
      }
        
      const updatedUser = { ...prev, collection: newCollection, favorites: newFavorites };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
    
    return result;
  };

  const toggleFavorite = (canId) => {
    if (!user) return { success: false, error: "not_logged_in" };
    if (!user.collection.includes(canId)) return { success: false, error: "not_in_collection" };
    
    let result = { success: true, isAdded: false };
    
    setUser(prev => {
      const isFav = (prev.favorites || []).includes(canId);
      const newFavorites = isFav 
        ? (prev.favorites || []).filter(id => id !== canId)
        : [...(prev.favorites || []), canId];
        
      result.isAdded = !isFav;
      const updatedUser = { ...prev, favorites: newFavorites };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
    
    return result;
  };

  const updateUserProfileImage = (type, dataUrl) => {
    if (!user) return;
    setUser(prev => {
      const updatedUser = { 
        ...prev, 
        [type === "avatar" ? "avatarUrl" : "bannerUrl"]: dataUrl 
      };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCollection, toggleFavorite, updateUserProfileImage, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
