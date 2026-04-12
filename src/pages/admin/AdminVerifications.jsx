import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { BadgeCheck, Search, Info, Clock, AlertTriangle, AlertCircle, XCircle, CheckCircle, FileImage, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";

export const AdminVerifications = () => {
  const { getAllVerifications, evaluateVerification } = useAuth();
  
  const [verifications, setVerifications] = useState([]);
  const [selectedVerif, setSelectedVerif] = useState(null);
  
  const [adminMemo, setAdminMemo] = useState("");
  const [showMemoPanel, setShowMemoPanel] = useState(null); // 'review' | 'rejected' | null

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getAllVerifications();
    setVerifications(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
  };

  const handleSelect = (v) => {
    setSelectedVerif(v);
    setAdminMemo("");
    setShowMemoPanel(null);
  };

  const handleEvaluation = (status) => {
     if ((status === "review" || status === "rejected") && !showMemoPanel) {
        setShowMemoPanel(status);
        return;
     }

     if (showMemoPanel && adminMemo.trim() === "") {
        toast.error("O preenchimento do relatório técnico é obrigatório.");
        return;
     }

     evaluateVerification(selectedVerif.id, selectedVerif.userId, status, adminMemo);
     toast.success(`Protocolo marcado como: ${status.toUpperCase()} com sucesso!`);
     
     // Remove from UI if decided, or just update data
     loadData();
     setSelectedVerif(null);
     setShowMemoPanel(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 text-[10px] font-bold uppercase clip-diagonal-btn">Pendente</span>;
      case "review": return <span className="bg-orange-500/20 text-orange-500 px-2 py-1 text-[10px] font-bold uppercase clip-diagonal-btn">Em Correção</span>;
      case "approved": return <span className="bg-sky-500/20 text-sky-500 px-2 py-1 text-[10px] font-bold uppercase clip-diagonal-btn">Aprovado</span>;
      case "rejected": return <span className="bg-red-500/20 text-red-500 px-2 py-1 text-[10px] font-bold uppercase clip-diagonal-btn">Reprovado</span>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row h-full overflow-hidden bg-[#050505]">
      {/* Left panel - List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#0a0a0a] flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-display text-white uppercase tracking-widest flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-monster-neon" />
            Auditoria
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Fila de Triagem</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
           {verifications.length === 0 ? (
             <div className="text-center text-gray-600 text-xs font-bold uppercase mt-10">Nenhum pedido na fila.</div>
           ) : (
              verifications.map((v) => (
                <div 
                  key={v.id} 
                  onClick={() => handleSelect(v)}
                  className={`p-4 border clip-diagonal-btn cursor-pointer transition-colors ${selectedVerif?.id === v.id ? 'bg-[#121212] border-monster-neon' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-white font-bold tracking-widest text-sm">@{v.username}</span>
                     {getStatusBadge(v.status)}
                  </div>
                  <div className="text-xs text-gray-500 font-mono truncate">{v.id}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">
                    {new Date(v.submittedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))
           )}
        </div>
      </div>

      {/* Right panel - Details */}
      <div className="flex-1 bg-[#121212] flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
         {!selectedVerif ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-50">
               <AlertCircle className="w-16 h-16 mb-4" />
               <p className="font-display uppercase tracking-widest text-lg">Selecione uma petição</p>
            </div>
         ) : (
            <div className="p-8 max-w-4xl mx-auto w-full animate-fade-in relative">
               
               {/* Quick close for mobile */}
               <button onClick={() => setSelectedVerif(null)} className="md:hidden absolute top-4 right-4 text-gray-500">
                  <X className="w-6 h-6" />
               </button>

               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-monster-gray flex items-center justify-center font-display text-2xl text-white outline outline-1 outline-white/10 uppercase overflow-hidden">
                     {selectedVerif.avatarUrl ? <img src={selectedVerif.avatarUrl} alt="" className="w-full h-full object-cover" /> : selectedVerif.username.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-display text-white uppercase tracking-widest leading-none mb-2">@{selectedVerif.username}</h1>
                    <div className="flex items-center gap-3">
                       {getStatusBadge(selectedVerif.status)}
                       <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">{selectedVerif.id}</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  {/* Declaracao */}
                  <div className="bg-[#1a1a1a] p-6 border border-white/5 border-l-4 border-l-monster-neon clip-diagonal">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Declaração do Colecionador
                    </h3>
                    <p className="text-gray-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {selectedVerif.desc}
                    </p>
                  </div>

                  {/* Arquivos */}
                  <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                       Mídias Comprobatórias Anexadas ({selectedVerif.files.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {selectedVerif.files.map((file, i) => (
                          <div key={i} className="bg-[#1a1a1a] border border-white/5 p-4 flex flex-col items-center justify-center text-center gap-2 aspect-square hover:bg-white/5 cursor-pointer transition-colors clip-diagonal-btn group">
                            <FileImage className="w-10 h-10 text-gray-600 group-hover:text-monster-neon transition-colors" />
                            <span className="text-white text-xs font-mono truncate w-full px-2" title={file.name}>{file.name}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{file.size} MB</span>
                          </div>
                       ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  {selectedVerif.status === "pending" || selectedVerif.status === "review" ? (
                     <div className="bg-[#0a0a0a] p-6 border border-white/10 mt-12 animate-fade-in shadow-2xl">
                        {!showMemoPanel ? (
                           <>
                             <h3 className="text-white font-display uppercase tracking-widest text-lg mb-6 border-b border-white/10 pb-4">
                               Veredito Curatorial
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <Button onClick={() => handleEvaluation("approved")} className="bg-sky-500 hover:bg-sky-400 text-black h-12 uppercase tracking-widest font-black">
                                  <CheckCircle className="w-4 h-4 mr-2" /> Aprovar Selo
                               </Button>
                               <Button onClick={() => handleEvaluation("review")} className="bg-orange-500 hover:bg-orange-400 text-black h-12 uppercase tracking-widest font-black">
                                  <AlertTriangle className="w-4 h-4 mr-2" /> Exigir Correção
                               </Button>
                               <Button onClick={() => handleEvaluation("rejected")} className="bg-red-600 hover:bg-red-500 text-white h-12 uppercase tracking-widest font-black border-red-600">
                                  <XCircle className="w-4 h-4 mr-2" /> Reprovar
                               </Button>
                             </div>
                           </>
                        ) : (
                           <div className="animate-fade-in">
                             <h3 className={`font-display uppercase tracking-widest text-lg mb-2 flex items-center gap-2 ${showMemoPanel === 'review' ? 'text-orange-500' : 'text-red-500'}`}>
                               {showMemoPanel === 'review' ? <AlertTriangle /> : <XCircle />}
                               {showMemoPanel === 'review' ? 'Registrar Pedido de Revisão' : 'Registrar Motivo de Reprovação'}
                             </h3>
                             <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">
                               O usuário receberá este texto no formato de uma notificação obrigatória.
                             </p>
                             <textarea 
                               value={adminMemo}
                               onChange={e => setAdminMemo(e.target.value)}
                               className={`w-full bg-[#121212] border p-4 text-white font-sans focus:outline-none transition-colors h-32 resize-none mb-4 ${showMemoPanel === 'review' ? 'border-orange-500/50 focus:border-orange-500' : 'border-red-500/50 focus:border-red-500'}`}
                               placeholder="Ex: Faltou imagens claras do fundo das latas ultra raras..."
                             />
                             <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setShowMemoPanel(null)}>Cancelar</Button>
                                <Button onClick={() => handleEvaluation(showMemoPanel)} className={showMemoPanel === 'review' ? 'bg-orange-500 text-black' : 'bg-red-600 text-white'}>
                                   Protocolar Resposta Oficial
                                </Button>
                             </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="bg-[#1a1a1a] p-6 border border-white/5 mt-12 bg-gray-900/30">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">
                          Status Finalizado
                        </h3>
                        {selectedVerif.adminMessage && (
                          <div className="bg-[#0a0a0a] p-4 text-gray-400 font-sans italic border-l-2 border-gray-600 mb-4">
                             "{selectedVerif.adminMessage}"
                          </div>
                        )}
                        <p className="text-white font-bold uppercase tracking-widest text-sm text-center">
                           Esta solicitação já encontra-se {selectedVerif.status === 'approved' ? 'APROVADA' : 'REPROVADA'}.
                        </p>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
