import React, { createContext, useContext, useState, useEffect } from "react";
import { updateAchievementProgress, syncUserAchievements } from "../lib/achievementsApi";
import { monstersData } from "../data/monsters";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock user session check
    const storedUser = localStorage.getItem("monsterVault_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Injection: dynamic check verification status from mock DB
      const db = JSON.parse(localStorage.getItem("monsterVault_verifications") || "[]");
      const myVerif = db.find(v => v.userId === parsedUser.id);
      if (myVerif) {
         parsedUser.verification_status = myVerif.status;
         if (myVerif.status === "approved") {
            parsedUser.isVerified = true;
         }
      }
      
      setUser(parsedUser);
      
      // Load Notifications
      const notifs = JSON.parse(localStorage.getItem(`monsterVault_notifications_${parsedUser.id}`) || "[]");
      setNotifications(notifs);
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
          displayName: email === "admin@monster.com" ? "Administrador" : "Monster Collector",
          email,
          password: "monster123", // default mock password for settings test
          username_changed_at: null,
          isVerified: email === "verificado@monster.com",
          verification_status: "idle",
          email,
          role,
          avatarUrl: "",
          memberSince: "2024",
          collection: ["m-original-green", "m-ultra-white", "m-mango-loco", "m-ultra-fiesta", "m-reserve-watermelon"],
          favorites: ["m-original-green", "m-mango-loco"],
          featured_achievement_id: null
        };
        // Check against mock DB for dynamic state
        const db = JSON.parse(localStorage.getItem("monsterVault_verifications") || "[]");
        const myVerif = db.find(v => v.userId === mockUser.id);
        if (myVerif) {
           mockUser.verification_status = myVerif.status;
           if (myVerif.status === "approved") {
              mockUser.isVerified = true;
           }
        }
        
        setUser(mockUser);
        localStorage.setItem("monsterVault_user", JSON.stringify(mockUser));
        
        // Load Notifications
        const notifs = JSON.parse(localStorage.getItem(`monsterVault_notifications_${mockUser.id}`) || "[]");
        setNotifications(notifs);
        
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
    setNotifications([]);
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
      }
        
      let newFavorites = prev.favorites || [];
      if (isOwned && newFavorites.includes(canId)) {
        newFavorites = newFavorites.filter(id => id !== canId);
        result.removedFromFavorites = true;
      }
        
      const updatedUser = { ...prev, collection: newCollection, favorites: newFavorites };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      
      // Synchronize all collection-based achievements dynamically
      setTimeout(() => {
        syncUserAchievements(updatedUser, monstersData);
      }, 0);

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

  const setFeaturedAchievement = (achievementId) => {
    if (!user) return;
    setUser(prev => {
      const updatedUser = { ...prev, featured_achievement_id: achievementId };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUserData = (updates) => {
    if (!user) return;
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem("monsterVault_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // ----------------------------------------------------
  // VERIFICATIONS & NOTIFICATIONS (MOCK DB SYSTEM)
  // ----------------------------------------------------
  const markNotificationsAsRead = () => {
    if (!user) return;
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`monsterVault_notifications_${user.id}`, JSON.stringify(updated));
  };

  const submitVerification = (desc, files) => {
    if (!user) return;
    let db = JSON.parse(localStorage.getItem("monsterVault_verifications") || "[]");
    
    // Remove if previously existed
    db = db.filter(v => v.userId !== user.id);
    
    const newRecord = {
      id: `v-${Date.now()}`,
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      status: "pending", 
      desc,
      files,
      adminMessage: null,
      submittedAt: new Date().toISOString()
    };
    
    db.push(newRecord);
    localStorage.setItem("monsterVault_verifications", JSON.stringify(db));
    updateUserData({ verification_status: "pending" });
  };
  
  const getAllVerifications = () => {
     return JSON.parse(localStorage.getItem("monsterVault_verifications") || "[]");
  };

  const evaluateVerification = (verificationId, targetUserId, status, message) => {
     let db = JSON.parse(localStorage.getItem("monsterVault_verifications") || "[]");
     const idx = db.findIndex(v => v.id === verificationId);
     
     if (idx !== -1) {
        db[idx].status = status;
        db[idx].adminMessage = message;
        localStorage.setItem("monsterVault_verifications", JSON.stringify(db));
     }
     
     // Generate notification for targeted user
     const notifs = JSON.parse(localStorage.getItem(`monsterVault_notifications_${targetUserId}`) || "[]");
     let notifType = "info";
     let notifMessage = "";
     
     if (status === "approved") {
        notifType = "success";
        notifMessage = "Sua Verificação Oficial foi APROVADA! O selo já está ativo no seu perfil.";
     } else if (status === "review") {
        notifType = "warning";
        notifMessage = "Sua Verificação necessita de correções/ajustes. Acesse as Configurações parar ler o relatório do Admin.";
     } else if (status === "rejected") {
        notifType = "error";
        notifMessage = "Sua Verificação Oficial foi REPROVADA pela curadoria.";
     }
     
     const newNotif = {
        id: `n-${Date.now()}`,
        message: notifMessage,
        type: notifType,
        read: false,
        createdAt: new Date().toISOString()
     };
     notifs.unshift(newNotif);
     localStorage.setItem(`monsterVault_notifications_${targetUserId}`, JSON.stringify(notifs));
     
     // Se o curador for o próprio user alvo (testando local), já atualiza a UI localmente em tempo real
     if (user && user.id === targetUserId) {
        setNotifications(notifs);
        if (status === "approved") updateUserData({ isVerified: true, verification_status: "approved" });
        if (status === "review") updateUserData({ verification_status: "review" });
        if (status === "rejected") updateUserData({ verification_status: "rejected" });
     }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCollection, toggleFavorite, updateUserProfileImage, setFeaturedAchievement, updateUserData, loading, notifications, markNotificationsAsRead, submitVerification, getAllVerifications, evaluateVerification }}>
      {children}
    </AuthContext.Provider>
  );
};
