import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  flavor: "",
  line: "",
  year: new Date().getFullYear(),
  country: "",
  edition_type: "",
  rarity: "Comum",
  description: "",
  imageUrl: ""
};

export const MonsterFormModal = ({ isOpen, onClose, onSave, editingMonster }) => {
  const [formData, setFormData] = useState(initialForm);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (editingMonster) {
      setFormData(editingMonster);
    } else {
      setFormData(initialForm);
    }
  }, [editingMonster, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, imageUrl: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.line || !formData.rarity) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    // Auto-generate ID if it's new
    const payload = {
      ...formData,
      id: formData.id || `m-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-monster-dark/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#1c1c1c] border border-monster-neon/30 w-full max-w-4xl clip-diagonal shadow-[0_0_30px_rgba(57,255,20,0.1)] relative my-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-monster-neon transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-display text-white uppercase tracking-widest border-b border-monster-neon/20 pb-4 mb-6 cursor-default">
            {editingMonster ? "Editar Lata" : "Adicionar Nova Lata"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
            {/* Left: Image Uploader */}
            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Imagem da Lata</label>
              
              <div 
                className={`relative w-full h-80 border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                  dragActive ? "border-monster-neon bg-monster-neon/10" : "border-gray-600 hover:border-monster-neon hover:bg-white/5"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-contain p-2 mix-blend-screen" />
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <UploadCloud className="h-10 w-10 text-gray-500 mb-2 group-hover:text-monster-neon" />
                    <span className="text-sm font-display tracking-widest text-gray-400 uppercase">Arraste a foto ou clique</span>
                  </div>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                />
              </div>
              {formData.imageUrl && (
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({...p, imageUrl: ""}))}
                  className="w-full mt-2 text-xs text-monster-red uppercase font-bold tracking-widest hover:underline"
                >
                  Remover Imagem
                </button>
              )}
            </div>

            {/* Right: Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Linha (Ex: Ultra) *</label>
                  <input required name="line" value={formData.line} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Sabor Principal</label>
                  <input name="flavor" value={formData.flavor} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Raridade *</label>
                  <select required name="rarity" value={formData.rarity} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border appearance-none cursor-pointer">
                    <option value="Comum">Comum</option>
                    <option value="Raro">Raro</option>
                    <option value="Ultra Raro">Ultra Raro</option>
                    <option value="Edição Limitada">Edição Limitada</option>
                    <option value="Exclusivo Regional">Exclusivo Regional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">País de Origem</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Ano</label>
                   <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Tipo de Edição</label>
                 <input name="edition_type" value={formData.edition_type} onChange={handleChange} placeholder="Ex: Regular, Descontinuada, Especial" className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Descrição / Curiosidades</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon focus:glow-border resize-none" />
              </div>

              <div className="pt-4 flex justify-end">
                 <Button type="submit" size="lg">
                   {editingMonster ? "Atualizar Lata" : "Cadastrar Lata"}
                 </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
