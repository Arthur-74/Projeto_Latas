import React from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Eye, CheckCircle2, ShieldAlert, BadgeCheck, Info } from "lucide-react";

export const NotificationsPage = () => {
  const { notifications, markNotificationsAsRead, markNotificationAsRead } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case "success": return <BadgeCheck className="w-8 h-8 text-sky-400" />;
      case "error": return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case "warning": return <Info className="w-8 h-8 text-orange-500" />;
      default: return <Bell className="w-8 h-8 text-white" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
           <div className="flex items-center gap-4 mb-2">
             <Bell className="w-10 h-10 text-monster-neon" />
             <h1 className="text-4xl font-display text-white uppercase tracking-widest">
               Central de Alertas
             </h1>
           </div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
             Acompanhe o status e atualizações da sua conta
           </p>
        </div>

        {unreadCount > 0 && (
           <button 
             onClick={markNotificationsAsRead}
             className="flex items-center gap-2 px-6 py-3 bg-monster-neon/10 hover:bg-monster-neon/20 text-monster-neon border border-monster-neon/50 uppercase font-bold tracking-widest text-sm transition-all clip-diagonal-btn"
           >
             <CheckCircle2 className="w-5 h-5" />
             Marcar {unreadCount} como lida{unreadCount !== 1 ? 's' : ''}
           </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
           <div className="py-20 flex flex-col items-center justify-center border border-white/5 bg-[#121212] clip-diagonal text-center">
              <Bell className="w-16 h-16 text-gray-700 mb-6" />
              <h3 className="text-2xl font-display uppercase tracking-widest text-gray-500">Caixa Vazia</h3>
              <p className="text-gray-600 font-bold tracking-widest text-sm">Você não possui nenhum alerta ativo no momento.</p>
           </div>
        ) : (
           notifications.map((n) => (
              <div 
                key={n.id} 
                className={`flex items-start gap-6 p-6 border-l-4 border border-white/5 clip-diagonal transition-all relative group
                ${n.read ? 'bg-[#121212] opacity-70 border-l-gray-700' : 'bg-[#1c1c1c] shadow-lg border-l-monster-neon/80'}`}
              >
                 <div className="shrink-0 mt-1 drop-shadow-lg">
                    {getIcon(n.type)}
                 </div>

                 <div className="flex-1 min-w-0 pr-12">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 
                       ${n.type === 'success' ? 'text-sky-400' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-orange-500' : 'text-gray-400'}`}>
                       {n.type === 'success' ? 'Aprovação de Curadoria' : n.type === 'error' ? 'Reprovação de Protocolo' : n.type === 'warning' ? 'Análise Pendente' : 'Informativo'}
                    </p>
                    <p className="text-gray-300 font-sans leading-relaxed text-lg mb-4">
                       {n.message}
                    </p>
                    <p className="text-xs text-gray-500 font-mono font-bold">
                       ID: {n.id} • {new Date(n.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                 </div>

                 {!n.read && (
                    <button 
                       onClick={() => markNotificationAsRead(n.id)}
                       className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 text-gray-400 hover:text-white hover:bg-monster-neon/20 hover:border-monster-neon border border-transparent rounded transition-all"
                       title="Marcar como analisada"
                    >
                       <Eye className="w-5 h-5" />
                    </button>
                 )}
              </div>
           ))
        )}
      </div>
    </div>
  );
};
