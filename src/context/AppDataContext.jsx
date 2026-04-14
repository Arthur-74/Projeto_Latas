import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { monstersData as oldMonstersData } from "../data/monsters";
import { generateSlug } from "../lib/itemUtils";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [familias, setFamilias] = useState([]);

  const [stats, setStats] = useState({
    totalCans: 0,
    totalCollectors: 0,
    totalCollectedItems: 0
  });

  // Initialization & Migration
  useEffect(() => {
    let localItems = JSON.parse(localStorage.getItem("monsterVault_items"));
    let localImages = JSON.parse(localStorage.getItem("monsterVault_images"));
    let localFamilias = JSON.parse(localStorage.getItem("monsterVault_familias"));

    // Migration Strategy: se não tem itens mas temos o old data
    if (!localItems || localItems.length === 0) {
      console.log("Migrando database antigo para as novas tabelas...");
      localItems = [];
      localImages = [];
      localFamilias = [];

      oldMonstersData.forEach(old => {
        // Create familia se não existir (baseada no 'line')
        let famId = `fam_${old.line.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
        if (!localFamilias.find(f => f.id === famId)) {
          localFamilias.push({ id: famId, nome: old.line });
        }

        const newItemType = {
          id: old.id,
          name: old.name,
          line: old.line,
          year: old.year || 0,
          country: old.country || "Desconhecido",
          design: old.edition_type || "Regular",
          idioma: "ND",
          volume_ml: 500,
          lote: "ND",
          rarity: old.rarity || "Comum",
          flavor: old.flavor || "",
          description: old.description || "",
          atributos: {
            acabamento: "Brilhante",
            tipo_abertura: "Standard",
            tem_selo_reciclavel: false
          },
          familia_id: famId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        newItemType.slug = generateSlug(newItemType);
        
        localItems.push(newItemType);

        if (old.imageUrl) {
          localImages.push({
            id: `img_${old.id}_1`,
            item_id: old.id,
            url: old.imageUrl,
            tipo: "frente",
            principal: true
          });
        }
      });

      localStorage.setItem("monsterVault_items", JSON.stringify(localItems));
      localStorage.setItem("monsterVault_images", JSON.stringify(localImages));
      localStorage.setItem("monsterVault_familias", JSON.stringify(localFamilias));
    }

    setItems(localItems);
    setImages(localImages);
    setFamilias(localFamilias);

    // Simulate stats
    setStats({
      totalCans: localItems.length,
      totalCollectors: 1240, // Mock number
      totalCollectedItems: 24500 // Mock number
    });
  }, []);

  const saveToStorage = (newItems, newImages, newFamilias) => {
    if (newItems) {
      setItems(newItems);
      localStorage.setItem("monsterVault_items", JSON.stringify(newItems));
      setStats(prev => ({ ...prev, totalCans: newItems.length }));
    }
    if (newImages) {
      setImages(newImages);
      localStorage.setItem("monsterVault_images", JSON.stringify(newImages));
    }
    if (newFamilias) {
      setFamilias(newFamilias);
      localStorage.setItem("monsterVault_familias", JSON.stringify(newFamilias));
    }
  };

  // ---- CRUD ITEMS ----
  const getItems = useCallback((filters = {}) => {
    let result = [...items];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.flavor.toLowerCase().includes(s) || 
        m.line.toLowerCase().includes(s)
      );
    }
    if (filters.rarity && filters.rarity !== "all") {
      result = result.filter(m => m.rarity === filters.rarity);
    }
    if (filters.country && filters.country !== "all") {
       result = result.filter(m => m.country === filters.country);
    }
    if (filters.year && filters.year !== "all") {
       result = result.filter(m => m.year === parseInt(filters.year));
    }
    if (filters.line && filters.line !== "all") {
       result = result.filter(m => m.line === filters.line);
    }
    return result;
  }, [items]);

  const getItemById = useCallback((id) => items.find(m => m.id === id), [items]);
  
  const getItemImages = useCallback((itemId) => images.filter(img => img.item_id === itemId), [images]);

  const createItem = (item) => {
    // Validate anti-duplication slug
    const slug = generateSlug(item);
    if (items.some(i => i.slug === slug)) {
      throw new Error("Uma lata com exatamente as mesmas características (nome, país, ano, design) já existe. Altere algum destes campos.");
    }
    const newItem = {
      ...item,
      id: item.id || `m-${Date.now()}`,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveToStorage([...items, newItem], null, null);
    return newItem;
  };

  const updateItem = (id, updatedFields) => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    
    let target = { ...items[idx], ...updatedFields };
    // Recalculate slug if core fields changed
    const newSlug = generateSlug(target);
    if (newSlug !== target.slug) {
       if (items.some(i => i.slug === newSlug && i.id !== id)) {
          throw new Error("Estas alterações causariam duplicação de slug com outra lata.");
       }
       target.slug = newSlug;
    }
    target.updated_at = new Date().toISOString();
    
    const newItems = [...items];
    newItems[idx] = target;
    saveToStorage(newItems, null, null);
    return target;
  };

  const deleteItem = (id) => {
    saveToStorage(items.filter(m => m.id !== id), images.filter(img => img.item_id !== id), null);
  };

  const duplicateItem = (id) => {
    const source = getItemById(id);
    if (!source) throw new Error("Item origem não encontrado.");
    
    const cloned = {
       ...source,
       id: `m-clone-${Date.now()}`,
       design: `${source.design} (Cópia)`, // Forçar diferência no slug initial
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString()
    };
    cloned.slug = generateSlug(cloned);
    
    saveToStorage([...items, cloned], null, null);
    return cloned;
  };

  const importItems = (dataArray) => {
    let successCount = 0;
    let newItems = [...items];
    for (const d of dataArray) {
       const slug = generateSlug(d);
       if (!newItems.some(i => i.slug === slug)) {
          newItems.push({
             ...d,
             id: d.id || `m-import-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
             slug,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
          });
          successCount++;
       }
    }
    saveToStorage(newItems, null, null);
    return successCount;
  };

  // ---- CRUD IMAGES ----
  const addItemImage = (itemId, dataUrl, tipo = "frente", principal = false) => {
    const newImg = {
      id: `img_${Date.now()}`,
      item_id: itemId,
      url: dataUrl,
      tipo,
      principal
    };
    let newImages = [...images];
    if (principal) {
      newImages = newImages.map(img => img.item_id === itemId ? { ...img, principal: false } : img);
    }
    newImages.push(newImg);
    saveToStorage(null, newImages, null);
    return newImg;
  };

  const removeItemImage = (imageId) => {
    saveToStorage(null, images.filter(img => img.id !== imageId), null);
  };

  // ---- CRUD FAMILIAS ----
  const getItemsByFamilia = useCallback((familiaId) => items.filter(m => m.familia_id === familiaId), [items]);

  // Backward Compat para AuthContext % etc (deprecated logically but maintained for now safely)
  const getMissingCans = (collection) => {
    return items.filter(m => !collection.includes(m.id));
  };

  const getUserPercentage = (collectionCount) => {
    if (items.length === 0) return 0;
    return Math.round((collectionCount / items.length) * 100);
  };

  return (
    <AppDataContext.Provider value={{
      // State
      items,
      images,
      familias,
      stats,
      monsters: items, // DEPRECATED: fallback for UI relying on 'monsters'
      
      // Selectors
      getItems,
      getItemById,
      getItemImages,
      getItemsByFamilia,
      getMissingCans,
      getUserPercentage,
      
      // Mutations
      createItem,
      updateItem,
      deleteItem,
      duplicateItem,
      importItems,
      
      addItemImage,
      removeItemImage
      
      // (old signatures mapped minimally)
      /* addMonster: createItem, updateMonster: updateItem, deleteMonster: deleteItem */
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
