import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Zap, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { getBadgeInfo, getBadgeStyle } from "../lib/badgeUtils";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { getUserPercentage } = useAppData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userCanCount = user?.collection?.length || 0;
  const badgeInfo = getBadgeInfo(userCanCount);
  const badgeStyle = badgeInfo ? getBadgeStyle(badgeInfo.name) : null;
  const progressBarWidth = Math.min((userCanCount / 500) * 100, 100);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-monster-neon/20 bg-monster-dark/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Zap className="h-6 w-6 text-monster-neon group-hover:glow-text transition-all" />
            <span className="font-display text-2xl tracking-widest text-monster-white group-hover:text-monster-neon transition-colors">
              Monster For Collectors
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
            <Link to="/catalog" className="hover:text-monster-neon transition-colors">Catálogo</Link>
            {user?.role === 'admin' && (
              <div className="flex items-center ml-4 gap-2 border-l border-white/10 pl-4">
                <Link to="/admin/catalog" className="text-monster-neon hover:text-white clip-diagonal-btn bg-monster-neon/10 md:inline-flex items-center hover:glow-text transition-all py-1 px-3 border border-monster-neon/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive mr-2"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
                   Latas
                </Link>
                <Link to="/admin/gamification" className="text-yellow-500 hover:text-white clip-diagonal-btn bg-yellow-500/10 md:inline-flex items-center transition-all py-1 px-3 border border-yellow-500/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy mr-2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                   Gamificação
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <Link to={`/u/${user.username}`} className="text-sm font-bold hover:text-monster-neon transition-colors">
                  {user.username}
                </Link>
                <div className="mt-1 flex items-center justify-end h-5">
                  {userCanCount > 0 && badgeInfo && badgeStyle ? (
                    <div 
                      className="inline-flex items-center gap-[6px] cursor-default"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <div 
                        className="font-display"
                        style={{
                          background: badgeStyle.bg,
                          border: `1px solid ${badgeStyle.border}`,
                          borderTop: `2px solid ${badgeStyle.accent}`,
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: badgeStyle.accent,
                          ...(badgeInfo.name === "Monstro" ? {
                            boxShadow: `0 0 0 1px #00ff0033`,
                            textShadow: `0 0 10px #00ff0088`
                          } : {})
                        }}
                      >
                        {badgeInfo.label}
                      </div>
                      <div 
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: badgeStyle.accent,
                          opacity: 0.85
                        }}
                      >
                        {badgeInfo.name}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-monster-gray border border-monster-neon flex items-center justify-center cursor-pointer glow-border overflow-hidden" 
                onClick={() => navigate('/dashboard')}
                title="Dashboard"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-monster-neon" />
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button>Criar Conta</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {user && (
        <div className="w-full h-1 bg-monster-gray">
          <div 
            className="h-full bg-monster-neon transition-all duration-1000 ease-out glow-border" 
            style={{ width: `${progressBarWidth}%` }} 
          />
        </div>
      )}
    </nav>
  );
};
