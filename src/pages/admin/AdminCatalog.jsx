import React, { useState, useMemo } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ConfirmDeleteModal } from "../../components/admin/ConfirmDeleteModal";
import { MonsterFormModal } from "../../components/admin/MonsterFormModal";
import { StorageMonitor } from "../../components/admin/StorageMonitor";
import { Edit2, Trash2, Plus, Search, Image as ImageIcon, Copy } from "lucide-react";
import toast from "react-hot-toast";

export const AdminCatalog = () => {
  const { getItems, getItemImages, createItem, updateItem, deleteItem, duplicateItem, importItems } = useAppData();
  
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const rawItems = getItems();

  const filteredItems = useMemo(() => {
    let result = rawItems;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(s) || m.line.toLowerCase().includes(s));
    }
    if (filterRarity !== "all") {
      result = result.filter(m => m.rarity === filterRarity);
    }
    return result;
  }, [rawItems, search, filterRarity]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDuplicate = (item) => {
    try {
      duplicateItem(item.id);
      toast.success("Lata duplicada com sucesso!");
    } catch (e) {
      toast.error(e.message || "Erro ao duplicar lata.");
    }
  };

  const initiateDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      toast.success("Lata excluída permanentemente.");
      setItemToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-monster-neon/20 pb-4">
        <div>
          <h1 className="text-4xl font-display text-white uppercase tracking-widest flex items-center gap-3">
             Gerenciador <span className="text-monster-neon">CMS</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
            Administração do Catálogo de Latas Específicas
          </p>
        </div>
        
        <Button size="lg" onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="h-5 w-5" /> Adicionar Lata
        </Button>
      </div>

      <StorageMonitor />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar por Nome ou Linha..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/10 focus:border-monster-neon outline-none py-2 pl-9 pr-4 text-white clip-diagonal-btn"
          />
        </div>
        <select 
          value={filterRarity} 
          onChange={(e) => setFilterRarity(e.target.value)}
          className="bg-[#1c1c1c] border border-white/10 p-2 text-white outline-none focus:border-monster-neon clip-diagonal-btn appearance-none cursor-pointer px-4 w-full md:w-64"
        >
          <option value="all">Filtro: Todas Raridades</option>
          <option value="Comum">Comum</option>
          <option value="Incomum">Incomum</option>
          <option value="Raro">Raro</option>
          <option value="Muito Raro">Muito Raro</option>
          <option value="Ultra Raro">Ultra Raro</option>
          <option value="Lendário">Lendário</option>
          <option value="Edição Limitada">Edição Limitada</option>
          <option value="Descontinuado">Descontinuado</option>
          <option value="Exclusivo Regional">Exclusivo Regional</option>
          <option value="Protótipo">Protótipo</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto bg-[#1c1c1c] border border-white/5 clip-diagonal">
        <table className="w-full text-left text-white font-body">
          <thead className="bg-monster-dark text-gray-400 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4 w-16">Imagem</th>
              <th className="p-4">Item Catalogado</th>
              <th className="p-4">Detalhes</th>
              <th className="p-4">Raridade</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredItems.map(item => {
               const primaryImg = getItemImages(item.id).find(i => i.principal) || getItemImages(item.id)[0];
               return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                      <div className="w-12 h-16 bg-monster-dark flex items-center justify-center -rotate-2 clip-diagonal overflow-hidden border border-white/10 group-hover:border-monster-neon/50">
                        {primaryImg ? (
                          <img src={primaryImg.url} alt={item.name} className="h-full object-contain" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                  </td>
                  <td className="p-4">
                      <div className="font-display text-lg tracking-widest group-hover:text-monster-neon transition-colors">{item.name}</div>
                      <div className="text-gray-400 text-sm uppercase">{item.line}</div>
                      <div className="text-xs text-gray-600 truncate max-w-xs">{item.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                      <div>{item.country} • {item.year}</div>
                      <div className="text-xs text-gray-500">{item.design} • {item.volume_ml}ml</div>
                  </td>
                  <td className="p-4 space-y-1">
                      <Badge variant={item.rarity}>{item.rarity}</Badge>
                  </td>
                  <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDuplicate(item)}
                          title="Duplicar Item"
                          className="hover:text-blue-400 hover:bg-blue-900/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEdit(item)}
                          title="Editar Lata"
                          className="hover:text-monster-neon hover:bg-[#2a2a2a]"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => initiateDelete(item)}
                          title="Excluir"
                          className="hover:text-monster-red hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </td>
                </tr>
               );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 uppercase font-bold tracking-widest text-sm">
                  Nenhuma lata cadastrada nos critérios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MonsterFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        editingItem={editingItem} 
      />
      
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        monsterName={itemToDelete?.name}
      />
    </div>
  );
};
