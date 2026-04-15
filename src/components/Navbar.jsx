import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Zap, LogOut, User as UserIcon, Settings as SettingsIcon, Bell, BadgeCheck, Eye, Menu, LayoutDashboard, Archive, Trophy } from "lucide-react";
import { Button } from "./ui/Button";
import { getBadgeInfo, getBadgeStyle } from "../lib/badgeUtils";

export const Navbar = () => {
  const { user, logout, notifications, markNotificationsAsRead, markNotificationAsRead } = useAuth();
  const { getUserPercentage } = useAppData();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userCanCount = user?.collection?.length || 0;
  const badgeInfo = getBadgeInfo(userCanCount);
  const badgeStyle = badgeInfo ? getBadgeStyle(badgeInfo.name) : null;
  const progressBarWidth = Math.min((userCanCount / 500) * 100, 100);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-monster-neon/20 bg-monster-dark/80 backdrop-blur-md">
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
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col justify-center items-end">
                <Link to={`/u/${user.username}`} className="text-sm font-bold hover:text-monster-neon transition-colors">
                  {user.displayName || user.username}
                </Link>
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-monster-gray border border-monster-neon flex items-center justify-center cursor-pointer glow-border overflow-hidden" 
                onClick={() => navigate(`/u/${user.username}`)}
                title="Meu Perfil"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-monster-neon" />
                )}
              </div>
              {/* Notifications */}
              <div 
                 className="relative"
                 onMouseEnter={() => setShowNotifs(true)}
                 onMouseLeave={() => setShowNotifs(false)}
              >
                <Button variant="ghost" size="icon" title="Notificações" className="pointer-events-none">
                   <Bell className={`h-5 w-5 hover:text-white transition-colors ${unreadCount > 0 ? 'text-white' : 'text-gray-400'}`} />
                   {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full glow-border shadow-[0_0_8px_#ef4444]"></span>}
                </Button>
                {showNotifs && (
                  <div className="absolute right-0 top-full pt-2 z-50">
                    <div className="w-80 bg-[#121212] border border-white/10 shadow-2xl clip-diagonal flex flex-col max-h-96">
                       <div className="p-4 border-b border-white/5 font-display uppercase tracking-widest text-sm text-white flex justify-between items-center">
                         <span>Centro de Alertas</span>
                         {unreadCount > 0 && (
                            <button 
                               onClick={(e) => { e.stopPropagation(); markNotificationsAsRead(); }}
                               className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-300 py-1 px-2 uppercase transition-colors clip-diagonal-btn"
                            >
                               Ler Tudo
                            </button>
                         )}
                       </div>
                       <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                         {notifications && notifications.length > 0 ? (
                            <>
                              {notifications.slice(0, 6).map(n => (
                                <div key={n.id} className={`p-4 border-b border-white/5 ${n.read ? 'opacity-50' : 'bg-white/5'} hover:bg-white/10 transition-colors relative group`}>
                                   <div className="flex justify-between items-start mb-1">
                                     <p className={`text-[10px] font-bold uppercase tracking-widest ${n.type === 'success' ? 'text-sky-400' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-orange-500' : 'text-gray-400'}`}>
                                        {n.type === 'success' ? 'Aprovado' : n.type === 'error' ? 'Reprovado' : n.type === 'warning' ? 'Revisão' : 'Info'}
                                     </p>
                                     {!n.read && (
                                       <button 
                                          onClick={() => markNotificationAsRead(n.id)}
                                          className="text-gray-500 hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 bg-[#1c1c1c]/80 clip-diagonal-btn"
                                          title="Marcar como lida"
                                       >
                                          <Eye className="w-3.5 h-3.5" />
                                       </button>
                                     )}
                                   </div>
                                   <p className="text-sm text-gray-300 font-sans leading-relaxed pr-6">{n.message}</p>
                                   <span className="text-[10px] text-gray-600 mt-2 block font-mono">{new Date(n.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              ))}
                              <Link 
                                 to="/notifications" 
                                 onClick={() => setShowNotifs(false)}
                                 className="block w-full text-center p-3 text-[10px] font-bold text-gray-400 bg-white/5 hover:bg-monster-neon/20 hover:text-monster-neon uppercase tracking-widest transition-colors"
                              >
                                 Ver Todas as Notificações
                              </Link>
                            </>
                         ) : (
                            <div className="p-8 text-center text-gray-600 text-xs uppercase tracking-widest font-bold">Nenhuma notificação</div>
                         )}
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div 
                 className="relative"
                 onMouseEnter={() => setShowUserMenu(true)}
                 onMouseLeave={() => setShowUserMenu(false)}
              >
                <Button variant="ghost" size="icon" title="Menu do Sistema" className="pointer-events-none">
                   <Menu className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </Button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 z-50 animate-fade-in">
                    <div className="w-56 bg-[#121212] border border-white/10 shadow-2xl clip-diagonal flex flex-col p-2">
                       <button 
                          onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-white/10 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                       >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                       </button>

                       <button 
                          onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-white/10 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                       >
                          <SettingsIcon className="w-4 h-4" />
                          Configurações
                       </button>

                       <button 
                          onClick={() => { setShowUserMenu(false); navigate('/notifications'); }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-white/10 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                       >
                          <Bell className="w-4 h-4" />
                          Meus Alertas
                       </button>

                       {user?.role === 'admin' && (
                         <>
                           <div className="h-px bg-white/10 my-1"></div>
                           <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Painel Admin</p>
                           <button 
                              onClick={() => { setShowUserMenu(false); navigate('/admin/catalog'); }}
                              className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-monster-neon hover:text-white hover:bg-monster-neon/20 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                           >
                              <Archive className="w-4 h-4" />
                              Latas
                           </button>
                           <button 
                              onClick={() => { setShowUserMenu(false); navigate('/admin/gamification'); }}
                              className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-yellow-500 hover:text-white hover:bg-yellow-500/20 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                           >
                              <Trophy className="w-4 h-4" />
                              Gamificação
                           </button>
                           <button 
                              onClick={() => { setShowUserMenu(false); navigate('/admin/verifications'); }}
                              className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-sky-500 hover:text-white hover:bg-sky-500/20 uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                           >
                              <BadgeCheck className="w-4 h-4" />
                              Auditoria
                           </button>
                         </>
                       )}

                       <div className="h-px bg-white/10 my-2"></div>
                       
                       <button 
                          onClick={() => { setShowUserMenu(false); handleLogout(); }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs text-[#cc0000] hover:text-white hover:bg-[#cc0000] uppercase tracking-widest font-bold transition-colors clip-diagonal-btn"
                       >
                          <LogOut className="w-4 h-4" />
                          Finalizar Sessão
                       </button>
                    </div>
                  </div>
                )}
              </div>
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
