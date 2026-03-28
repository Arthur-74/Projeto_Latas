import React, { useState, useMemo } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ConfirmDeleteModal } from "../../components/admin/ConfirmDeleteModal";
import { MonsterFormModal } from "../../components/admin/MonsterFormModal";
import { Edit2, Trash2, Plus, Search, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export const AdminCatalog = () => {
  const { monsters, addMonster, updateMonster, deleteMonster } = useAppData();
  
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [monsterToDelete, setMonsterToDelete] = useState(null);

  const filteredMonsters = useMemo(() => {
    let result = monsters;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(s) || m.line.toLowerCase().includes(s));
    }
    if (filterRarity !== "all") {
      result = result.filter(m => m.rarity === filterRarity);
    }
    return result;
  }, [monsters, search, filterRarity]);

  const handleOpenAdd = () => {
    setEditingMonster(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (monster) => {
    setEditingMonster(monster);
    setIsFormOpen(true);
  };

  const handleSave = (payload) => {
    if (editingMonster) {
      updateMonster(payload.id, payload);
      toast.success("Lata atualizada com sucesso!");
    } else {
      addMonster(payload);
      toast.success("Nova lata adicionada ao catálogo!");
    }
    setIsFormOpen(false);
  };

  const initiateDelete = (monster) => {
    setMonsterToDelete(monster);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (monsterToDelete) {
      deleteMonster(monsterToDelete.id);
      toast.success("Lata excluída permanentemente.");
      setMonsterToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-monster-neon/20 pb-4">
        <div>
          <h1 className="text-4xl font-display text-white uppercase tracking-widest flex items-center gap-3">
             Gerenciador <span className="text-monster-neon">CMS</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
            Administração do Catálogo de Latas
          </p>
        </div>
        
        <Button size="lg" onClick={handleOpenAdd} className="font-bold flex items-center gap-2">
          <Plus className="h-5 w-5" /> Adicionar Lata
        </Button>
      </div>

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
          <option value="Raro">Raro</option>
          <option value="Ultra Raro">Ultra Raro</option>
          <option value="Edição Limitada">Edição Limitada</option>
          <option value="Exclusivo Regional">Exclusivo Regional</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto bg-[#1c1c1c] border border-white/5 clip-diagonal">
        <table className="w-full text-left text-white font-body">
          <thead className="bg-monster-dark text-gray-400 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4 w-16">Imagem</th>
              <th className="p-4">Lata Base</th>
              <th className="p-4">Detalhes</th>
              <th className="p-4">Raridade</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMonsters.map(monster => (
               <tr key={monster.id} className="hover:bg-white/5 transition-colors group">
                 <td className="p-4">
                    <div className="w-12 h-16 bg-monster-dark flex items-center justify-center -rotate-2 clip-diagonal overflow-hidden border border-white/10 group-hover:border-monster-neon/50">
                       {monster.imageUrl ? (
                         <img src={monster.imageUrl} alt={monster.name} className="h-full object-contain" />
                       ) : (
                         <ImageIcon className="h-5 w-5 text-gray-600" />
                       )}
                    </div>
                 </td>
                 <td className="p-4">
                    <div className="font-display text-lg tracking-widest group-hover:text-monster-neon transition-colors">{monster.name}</div>
                    <div className="text-gray-400 text-sm uppercase">{monster.line}</div>
                 </td>
                 <td className="p-4 text-sm text-gray-300">
                    <div>{monster.country} • {monster.year}</div>
                    <div className="text-xs text-gray-500">{monster.edition_type || "Regular"}</div>
                 </td>
                 <td className="p-4 space-y-1">
                    <Badge variant={monster.rarity}>{monster.rarity}</Badge>
                 </td>
                 <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleOpenEdit(monster)}
                         title="Editar Lata"
                         className="hover:text-monster-neon hover:bg-[#2a2a2a]"
                       >
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => initiateDelete(monster)}
                         title="Excluir"
                         className="hover:text-monster-red hover:bg-red-900/20"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                 </td>
               </tr>
            ))}
            {filteredMonsters.length === 0 && (
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
        onSave={handleSave} 
        editingMonster={editingMonster} 
      />
      
      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        monsterName={monsterToDelete?.name}
      />
    </div>
  );
};
