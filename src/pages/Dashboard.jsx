import React from "react";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Link, Navigate } from "react-router-dom";
import { CanCard } from "../components/CanCard";
import { Trophy, Flame, Zap } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const { monsters, getUserPercentage, getMissingCans } = useAppData();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const pct = getUserPercentage(user.collection.length);
  const missingCans = getMissingCans(user.collection).slice(0, 4); // Show 4 suggestions

  const ownedCans = user.collection.map(id => monsters.find(m => m.id === id)).filter(Boolean);
  const latestCans = [...ownedCans].reverse().slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header Info */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-monster-gray/40 border border-monster-neon/30 p-8 clip-diagonal relative glow-border">
        <div className="w-32 h-32 rounded-full border-4 border-monster-neon bg-monster-dark flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-4xl font-display text-monster-neon object-cover">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-display tracking-widest uppercase text-white">
            {user.username}
          </h1>
          <p className="text-monster-neon font-bold tracking-widest uppercase text-sm">
            Membro desde {user.memberSince} • Latas Totais: {user.collection.length}
          </p>
        </div>
        
        <div className="w-full md:w-64">
           <div className="flex justify-between items-end mb-2 font-display uppercase tracking-widest">
             <span className="text-gray-400">Progresso</span>
             <span className="text-3xl text-monster-neon glow-text">{pct}%</span>
           </div>
           <div className="h-3 w-full bg-monster-dark border border-white/10">
             <div className="h-full bg-monster-neon transition-all duration-1000" style={{ width: `${pct}%` }}/>
           </div>
        </div>
      </section>

      {/* Trophies & Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Trophy className="h-10 w-10 text-yellow-500" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Conquistas</div>
            <div className="text-2xl font-display text-white">3 Desbloqueadas</div>
          </div>
        </div>
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Flame className="h-10 w-10 text-monster-red" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Raridade Média</div>
            <div className="text-2xl font-display text-white">Raro</div>
          </div>
        </div>
        <div className="bg-monster-gray/30 p-6 flex items-center gap-4 clip-diagonal border border-transparent hover:border-monster-neon/50 transition-colors">
          <Zap className="h-10 w-10 text-monster-neon" />
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Latas Faltantes</div>
            <div className="text-2xl font-display text-white">{monsters.length - user.collection.length}</div>
          </div>
        </div>
      </section>

      {/* Last Added */}
      {latestCans.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-display text-monster-white tracking-widest uppercase border-b border-monster-neon pb-2 inline-block">
               Adicionadas Recentemente
             </h2>
             <Link to="/catalog" className="text-sm font-bold text-monster-neon hover:text-white uppercase tracking-widest transition-colors mb-2">Ver Coleção</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {latestCans.map(can => (
               <CanCard key={`latest-${can.id}`} monster={can} />
             ))}
          </div>
        </section>
      )}

      {/* Suggested Missing */}
      {missingCans.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-display text-monster-white tracking-widest uppercase border-b border-monster-neon pb-2 inline-block">
               Sugestões: O Que Falta
             </h2>
             <Link to="/catalog" className="text-sm font-bold text-monster-neon hover:text-white uppercase tracking-widest transition-colors mb-2">Explorar Tudo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {missingCans.map(can => (
               <CanCard key={`missing-${can.id}`} monster={can} />
             ))}
          </div>
        </section>
      )}
    </div>
  );
};
