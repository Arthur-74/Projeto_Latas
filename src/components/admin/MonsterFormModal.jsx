import React, { useState, useEffect } from "react";
import { UploadCloud, X, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";
import { useAppData } from "../../context/AppDataContext";
import { resizeAndCompressImage } from "../../lib/itemUtils";

const initialForm = {
  name: "",
  flavor: "",
  line: "",
  year: new Date().getFullYear(),
  country: "",
  design: "",
  idioma: "",
  volume_ml: 500,
  lote: "",
  rarity: "Comum",
  description: "",
  familia_id: ""
};

export const MonsterFormModal = ({ isOpen, onClose, editingItem }) => {
  const { familias, createItem, updateItem, getItemImages, addItemImage, removeItemImage } = useAppData();
  const [formData, setFormData] = useState(initialForm);
  const [itemImages, setItemImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setItemImages(getItemImages(editingItem.id));
    } else {
      setFormData(initialForm);
      setItemImages([]);
    }
  }, [editingItem, isOpen, getItemImages]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsProcessingImg(true);
    try {
      const { dataUrl, sizeKb } = await resizeAndCompressImage(file, 800, 0.7);
      
      if (sizeKb > 350) {
        toast.error(`A imagem (${sizeKb}KB) excedeu o limite seguro de 350KB. Tente outra imagem.`);
        setIsProcessingImg(false);
        return;
      }

      // Se estamos editando uma lata existente, salvamos diretamente via API
      if (editingItem) {
        const principal = itemImages.length === 0;
        const newImg = addItemImage(editingItem.id, dataUrl, "frente", principal);
        setItemImages(prev => [...prev.map(i => principal ? {...i, principal: false} : i), newImg]);
        toast.success(`Imagem adicionada (${sizeKb}KB)`);
      } else {
        // Se estamos CRIANDO, apenas guardamos no state local as strings
        setItemImages(prev => [...prev, { temp_id: Date.now(), url: dataUrl, principal: prev.length === 0 }]);
        toast.success(`Imagem otimizada na memória (${sizeKb}KB)`);
      }
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Erro ao processar imagem");
    }
    setIsProcessingImg(false);
  };

  const handleRemoveImage = (img) => {
    if (editingItem && img.id) {
       removeItemImage(img.id);
       setItemImages(prev => prev.filter(i => i.id !== img.id));
    } else {
       setItemImages(prev => prev.filter(i => i.temp_id !== img.temp_id));
    }
  };

  const setAsPrincipal = (img) => {
    if (editingItem && img.id) {
       // O contexto no addItemImage gerencia a troca, mas vamos fazer via update manual pra nao complicar
       // A maneira mais fácil é remover e adicionar novamente como principal ou adicionar uma função
       // Como nao criamos updateItemImage, vamos remover e recriar para simplificar.
       removeItemImage(img.id);
       const newImg = addItemImage(editingItem.id, img.url, img.tipo, true);
       setItemImages(prev => [...prev.filter(i => i.id !== img.id).map(i => ({...i, principal: false})), newImg]);
    } else {
       setItemImages(prev => prev.map(i => ({ ...i, principal: i.temp_id === img.temp_id })));
    }
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
    
    // Processamento custom de família ID auto se não for enviada
    const finalFamiliaId = formData.familia_id || `fam_${formData.line.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    const payload = { ...formData, familia_id: finalFamiliaId };
    
    try {
      if (editingItem) {
         updateItem(editingItem.id, payload);
         toast.success("Lata atualizada com sucesso!");
      } else {
         const newItem = createItem(payload);
         // Savar as imagens temporarias
         itemImages.forEach(img => {
            addItemImage(newItem.id, img.url, "frente", img.principal);
         });
         toast.success("Lata criada com sucesso!");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Erro indesperado.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-monster-dark/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#1c1c1c] border border-monster-neon/30 w-full max-w-5xl clip-diagonal shadow-[0_0_30px_rgba(57,255,20,0.1)] relative my-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-monster-neon transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-display text-white uppercase tracking-widest border-b border-monster-neon/20 pb-4 mb-6 cursor-default">
            {editingItem ? "Editar Ficha da Lata" : "Cadastrar Nova Lata"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            {/* Left: Images */}
            <div className="w-full lg:w-1/3 min-h-[400px]">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                 Galeria de Imagens <span className="text-monster-neon">({itemImages.length})</span>
              </label>
              
              <div 
                className={`relative w-full h-48 border-2 border-dashed mb-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                  dragActive ? "border-monster-neon bg-monster-neon/10" : "border-gray-600 hover:border-monster-neon hover:bg-white/5"
                } ${isProcessingImg ? "opacity-50 pointer-events-none" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                 <div className="flex flex-col items-center text-center p-4">
                    <UploadCloud className="h-8 w-8 text-gray-500 mb-2 group-hover:text-monster-neon" />
                    <span className="text-xs font-display tracking-widest text-gray-400 uppercase">
                       {isProcessingImg ? "Otimizando..." : "Arraste ou clique"}
                    </span>
                    <span className="text-[10px] text-gray-600 mt-1">Resize auto &lt; 350kb</span>
                 </div>
                 <input 
                   id="file-upload" 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                 />
              </div>

              {/* Grid de Imagens */}
              <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                 {itemImages.map((img, idx) => (
                    <div key={img.id || img.temp_id} className={`relative bg-black border ${img.principal ? 'border-monster-neon' : 'border-white/10'} p-1 h-32 flex items-center justify-center group`}>
                       <img src={img.url} alt="Preview" className="h-full w-full object-contain mix-blend-screen" />
                       
                       {img.principal && (
                          <div className="absolute top-1 left-1 bg-monster-neon text-black text-[9px] uppercase font-bold px-1 rounded-sm">
                             Principal
                          </div>
                       )}

                       <div className="absolute inset-0 bg-black/80 flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
                           {!img.principal && (
                              <button type="button" onClick={() => setAsPrincipal(img)} className="text-[9px] bg-monster-neon text-black px-2 py-1 uppercase font-bold w-[80%] hover:brightness-125">
                                Set Principal
                              </button>
                           )}
                           <button type="button" onClick={() => handleRemoveImage(img)} className="flex items-center gap-1 text-[9px] bg-monster-red text-white px-2 py-1 uppercase font-bold w-[80%] justify-center hover:brightness-125">
                               <Trash2 className="h-3 w-3" /> Excluir
                           </button>
                       </div>
                    </div>
                 ))}
                 {itemImages.length === 0 && (
                    <div className="col-span-2 text-center text-gray-600 text-xs italic py-4 border border-white/5 border-dashed">
                      Nenhuma imagem associada. <br/> Adicione pelo menos a frente da lata.
                    </div>
                 )}
              </div>
            </div>

            {/* Right: Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nome da Lata *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Linha *</label>
                  <input required name="line" value={formData.line} onChange={handleChange} placeholder="Ex: Ultra" className="w-full bg-monster-dark border flex-col border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Raridade *</label>
                  <select required name="rarity" value={formData.rarity} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon appearance-none cursor-pointer text-sm">
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
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">País</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ano</label>
                   <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Design</label>
                  <input name="design" value={formData.design} onChange={handleChange} placeholder="Ex: EU Label v2" className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Idioma</label>
                  <input name="idioma" value={formData.idioma} onChange={handleChange} placeholder="Ex: DE/EN" className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Volume (ml)</label>
                  <input type="number" name="volume_ml" value={formData.volume_ml} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lote Impresso</label>
                  <input name="lote" value={formData.lote} onChange={handleChange} placeholder="Ex: B2-L04" className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon text-sm" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sabor (Família Relacionada)</label>
                  <select name="familia_id" value={formData.familia_id} onChange={handleChange} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon appearance-none cursor-pointer text-sm">
                     <option value="">-- Gerar Auto pelo Linha --</option>
                     {familias.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notas Adicionais do Item (Falhas, detalhes impressos, etc)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-monster-dark border border-white/20 p-2 text-white outline-none focus:border-monster-neon resize-none text-sm" />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-white/10">
                 <div className="text-[10px] text-gray-500 uppercase tracking-widest pt-2">
                    {editingItem && `ID: ${editingItem.id}`} <br/>
                    {editingItem && `Slug: ${editingItem.slug}`}
                 </div>
                 <Button type="submit" size="lg" className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                   {editingItem ? "Salvar Alterações" : "Cadastrar Nova Lata na Base"}
                 </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
