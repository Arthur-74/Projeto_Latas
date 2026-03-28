import React, { createContext, useContext, useState, useEffect } from "react";
import { monstersData } from "../data/monsters";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [monsters, setMonsters] = useState([]);
  const [stats, setStats] = useState({
    totalCans: 0,
    totalCollectors: 0,
    totalCollectedItems: 0
  });

  useEffect(() => {
    // Simulate fetching data
    setMonsters(monstersData);
    
    // Simulate stats
    setStats({
      totalCans: monstersData.length,
      totalCollectors: 1240, // Mock number
      totalCollectedItems: 24500 // Mock number
    });
  }, []);

  const getMonsterById = (id) => {
    return monsters.find(m => m.id === id);
  };

  const getUserPercentage = (collectionCount) => {
    if (monsters.length === 0) return 0;
    return Math.round((collectionCount / monsters.length) * 100);
  };

  const getMissingCans = (collection) => {
    return monsters.filter(m => !collection.includes(m.id));
  };

  const addMonster = (monster) => {
    setMonsters(prev => [monster, ...prev]);
  };

  const updateMonster = (id, updatedMonster) => {
    setMonsters(prev => prev.map(m => m.id === id ? { ...m, ...updatedMonster } : m));
  };

  const deleteMonster = (id) => {
    setMonsters(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      monsters,
      stats,
      getMonsterById,
      getUserPercentage,
      getMissingCans,
      addMonster,
      updateMonster,
      deleteMonster
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
