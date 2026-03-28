import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Zap } from "lucide-react";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // using same mock function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password); // just an imitation
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-monster-neon opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-monster-gray/80 border border-white/10 p-8 clip-diagonal relative z-10 backdrop-blur-md glow-border">
        <div className="text-center mb-8 flex flex-col items-center">
          <Zap className="h-12 w-12 text-monster-neon mb-4 glow-text" />
          <h2 className="text-3xl font-display uppercase tracking-[0.2em] text-white">RECRUTAMENTO</h2>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-2">Junte-se à Revolução</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-monster-dark/50 border border-white/20 p-3 outline-none focus:border-monster-neon focus:glow-border transition-all text-white font-body clip-diagonal-btn"
              placeholder="seu_nome"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-monster-dark/50 border border-white/20 p-3 outline-none focus:border-monster-neon focus:glow-border transition-all text-white font-body clip-diagonal-btn"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-monster-dark/50 border border-white/20 p-3 outline-none focus:border-monster-neon focus:glow-border transition-all text-white font-body clip-diagonal-btn"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? "Processando..." : "Criar Minha Conta"}
          </Button>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
              Já tem conta? <Link justify="center" to="/login" className="text-monster-neon hover:underline">Entre no Vault</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
