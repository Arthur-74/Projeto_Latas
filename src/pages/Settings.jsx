import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, CheckCircle, Save, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";

const maskEmail = (email) => {
  if (!email) return "";
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name}***@${domain}`;
  return `${name.substring(0, 2)}***@${domain}`;
};

const checkPasswordRules = (pwd) => ({
  length: pwd.length >= 8,
  uppercase: /[A-Z]/.test(pwd),
  number: /[0-9]/.test(pwd),
  special: /[!@#$%^&*]/.test(pwd),
});

export const Settings = () => {
  const { user, updateUserData } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const [activeTab, setActiveTab] = useState("perfil");
  const [isDirty, setIsDirty] = useState(false);

  // Perfil State
  const [displayName, setDisplayName] = useState(user.displayName || user.username);
  const [username, setUsername] = useState(user.username);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'checking' | 'available' | 'taken' | 'invalid' | null
  const [usernameErrorMsh, setUsernameErrorMsg] = useState("");
  const typingTimer = useRef(null);

  // Modal de username state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Conta State
  const [newEmail, setNewEmail] = useState("");

  // Seguranca State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    if (isDirty) {
      if (!window.confirm("Você tem alterações não salvas. Deseja sair perdendo as modificações?")) {
        return;
      }
    }
    // Reset dirty state when changing tabs
    setIsDirty(false);
    setActiveTab(tabId);
    
    // Reset inputs
    setDisplayName(user.displayName || user.username);
    setUsername(user.username);
    setUsernameStatus(null);
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Profile Handlers
  const handleProfileChange = (e) => {
    setIsDirty(true);
    const { name, value } = e.target;
    if (name === "displayName") {
      setDisplayName(value);
    } else if (name === "username") {
      setUsername(value);
      checkUsername(value);
    }
  };

  const checkUsername = (val) => {
    setUsernameStatus("checking");
    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      // Regras de validacao
      if (val === user.username) {
        setUsernameStatus(null);
        return;
      }
      if (val.length < 3 || val.length > 20) {
        setUsernameStatus("invalid");
        setUsernameErrorMsg("Deve ter entre 3 e 20 caracteres");
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
        setUsernameStatus("invalid");
        setUsernameErrorMsg("Apenas letras, números, hífen e underline");
        return;
      }
      const forbidden = ["admin", "root", "merda", "fuck", "bitch"];
      if (forbidden.some(f => val.toLowerCase().includes(f))) {
        setUsernameStatus("invalid");
        setUsernameErrorMsg("Este nome de usuário não é permitido");
        return;
      }
      
      // Mocked checking
      if (val === "Vault_Admin" || val === "monster_collector" || val === "arthur" || val === "caçador") {
         setUsernameStatus("taken");
         setUsernameErrorMsg("Username já em uso");
      } else {
         setUsernameStatus("available");
      }
    }, 500);
  };

  const calculateCooldown = () => {
    if (!user.username_changed_at) return { eligible: true };
    const diff = (Date.now() - new Date(user.username_changed_at).getTime()) / (1000 * 3600 * 24);
    if (diff < 30) {
      return { eligible: false, daysLeft: Math.ceil(30 - diff) };
    }
    return { eligible: true };
  };

  const cooldown = calculateCooldown();

  const handleSaveProfile = () => {
    if (username !== user.username) {
      // Must prompt modal
      setShowConfirmModal(true);
    } else {
      // Just save display name
      updateUserData({ displayName });
      setIsDirty(false);
      toast.success("Perfil atualizado com sucesso!");
    }
  };

  const confirmUsernameChange = () => {
    updateUserData({ 
      displayName, 
      username, 
      username_changed_at: new Date().toISOString() 
    });
    setIsDirty(false);
    setShowConfirmModal(false);
    toast.success("Username e Perfil alterados com sucesso!", {
       style: { background: '#1c1c1c', color: '#39ff14', border: '1px solid #39ff14' }
    });
  };

  // Account Handlers
  const handleSaveEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error("Insira um endereço de e-mail válido.");
      return;
    }
    toast.success("Um e-mail de verificação foi enviado para " + maskEmail(user.email) + " antes da troca ser confirmada.");
    setNewEmail("");
    setIsDirty(false);
  };

  // Security Handlers
  const pwdRules = checkPasswordRules(newPassword);
  const isValidNewPwd = pwdRules.length && pwdRules.uppercase && pwdRules.number && pwdRules.special;
  const canSavePassword = oldPassword.length > 0 && isValidNewPwd && newPassword === confirmPassword;

  const handleSavePassword = () => {
    if (oldPassword !== user.password) {
      toast.error("A senha atual está incorreta.");
      return;
    }
    updateUserData({ password: newPassword });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsDirty(false);
    toast.success("Senha atualizada com sucesso!");
  };

  // Layout Setup
  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "conta", label: "Conta", icon: Mail },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "verificacao", label: "Verificação", icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24 md:pb-0 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl flex flex-col relative h-full">
        <h1 className="text-4xl md:text-5xl font-display text-white uppercase tracking-wider mb-8">
          Configurações
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-start h-full pb-10">
          
          {/* Sidebar */}
          <nav className="w-full md:w-64 flex flex-col gap-2 pb-4 md:pb-0" style={{ scrollbarWidth: 'none' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-bold uppercase tracking-widest text-sm text-left transition-all whitespace-nowrap clip-diagonal-btn
                    ${isActive 
                      ? 'bg-monster-neon/20 text-monster-neon border-l-4 border-monster-neon shadow-lg' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 w-full bg-[#1c1c1c] p-6 md:p-10 clip-diagonal border border-white/5 shadow-2xl min-h-[500px]">
            
            {/* TABS RENDER */}

            {/* PERFIL */}
            {activeTab === "perfil" && (
              <div className="max-w-xl animate-fade-in">
                <h2 className="text-2xl font-display text-white border-b border-white/10 pb-4 mb-8 uppercase tracking-widest">
                  Editar Perfil
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome de Exibição</label>
                    <input 
                      type="text" 
                      name="displayName"
                      value={displayName}
                      onChange={handleProfileChange}
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 focus:outline-none focus:border-monster-neon transition-colors"
                      placeholder="Identificação Pública" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       Username
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold flex items-center h-full">@</span>
                      <input 
                        type="text" 
                        name="username"
                        value={username}
                        disabled={!cooldown.eligible}
                        onChange={handleProfileChange}
                        style={{ paddingLeft: '30px' }}
                        className={`w-full bg-[#121212] border text-white p-3 focus:outline-none transition-colors 
                          ${!cooldown.eligible ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:border-monster-neon'}
                          ${usernameStatus === 'invalid' || usernameStatus === 'taken' ? 'border-red-500 focus:border-red-500' : ''}
                          ${usernameStatus === 'available' ? 'border-monster-neon' : ''}
                        `}
                      />
                    </div>
                    
                    {/* Status Feedback */}
                    <div className="mt-2 h-5">
                       {!cooldown.eligible && (
                          <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
                            Você poderá alterar seu username em {cooldown.daysLeft} dias.
                          </div>
                       )}
                       {cooldown.eligible && usernameStatus === 'checking' && (
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verificando...</div>
                       )}
                       {usernameStatus === 'available' && (
                          <div className="text-xs font-bold text-monster-neon uppercase tracking-widest">✓ Disponível</div>
                       )}
                       {usernameStatus === 'invalid' || usernameStatus === 'taken' ? (
                          <div className="text-xs font-bold text-red-500 uppercase tracking-widest">✗ {usernameErrorMsh}</div>
                       ) : null}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="float-right"
                      onClick={handleSaveProfile}
                      disabled={
                        (!isDirty) || 
                        (username !== user.username && usernameStatus !== 'available') || 
                        displayName.trim().length === 0
                      }
                    >
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTA */}
            {activeTab === "conta" && (
              <div className="max-w-xl animate-fade-in">
                <h2 className="text-2xl font-display text-white border-b border-white/10 pb-4 mb-8 uppercase tracking-widest">
                  Conta e Acesso
                </h2>

                <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">E-mail Atual</label>
                     <div className="w-full bg-[#121212] border border-white/10 text-gray-500 p-3 opacity-70 cursor-not-allowed font-mono">
                        {maskEmail(user.email)}
                     </div>
                     <p className="text-[10px] text-yellow-500 mt-2 uppercase tracking-widest font-bold">
                       Atenção: Um e-mail de confirmação será enviado para seu endereço atual antes de aplicar a troca.
                     </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Novo Endereço de E-mail</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => { setNewEmail(e.target.value); setIsDirty(true); }}
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 focus:outline-none focus:border-monster-neon transition-colors"
                      placeholder="novonome@exemplo.com" 
                    />
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="float-right"
                      disabled={!isDirty || newEmail.length === 0}
                      onClick={handleSaveEmail}
                    >
                      Solicitar Troca <Mail className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SEGURANÇA */}
            {activeTab === "seguranca" && (
              <div className="max-w-xl animate-fade-in">
                <h2 className="text-2xl font-display text-white border-b border-white/10 pb-4 mb-8 uppercase tracking-widest">
                  Alteração de Senha
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Senha Atual</label>
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => { setOldPassword(e.target.value); setIsDirty(true); }}
                      className="w-full bg-[#121212] border border-white/10 text-white p-3 focus:outline-none focus:border-monster-neon transition-colors"
                      placeholder="••••••••" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                     <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nova Senha</label>
                       <input 
                         type="password" 
                         value={newPassword}
                         onChange={(e) => { setNewPassword(e.target.value); setIsDirty(true); }}
                         className="w-full bg-[#121212] border border-white/10 text-white p-3 focus:outline-none focus:border-monster-neon transition-colors"
                         placeholder="••••••••" 
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirmar Nova Senha</label>
                       <input 
                         type="password" 
                         value={confirmPassword}
                         onChange={(e) => { setConfirmPassword(e.target.value); setIsDirty(true); }}
                         className={`w-full bg-[#121212] border p-3 focus:outline-none transition-colors ${
                            confirmPassword.length > 0 && confirmPassword !== newPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-monster-neon'
                         }`}
                         placeholder="••••••••" 
                       />
                     </div>
                  </div>

                  {/* Dynamic Checklist */}
                  <div className="bg-[#121212] p-4 border border-white/5 space-y-2">
                     <div className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-widest">Regras de Segurança</div>
                     <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${pwdRules.length ? 'text-monster-neon' : 'text-gray-600'}`}>
                        {pwdRules.length ? '✓' : '✗'} Mínimo de 8 caracteres
                     </div>
                     <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${pwdRules.uppercase ? 'text-monster-neon' : 'text-gray-600'}`}>
                        {pwdRules.uppercase ? '✓' : '✗'} Pelo menos 1 letra maiúscula
                     </div>
                     <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${pwdRules.number ? 'text-monster-neon' : 'text-gray-600'}`}>
                        {pwdRules.number ? '✓' : '✗'} Pelo menos 1 número
                     </div>
                     <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${pwdRules.special ? 'text-monster-neon' : 'text-gray-600'}`}>
                        {pwdRules.special ? '✓' : '✗'} Caractere especial (!@#$%^&*)
                     </div>
                     {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500">
                          As senhas não coincidem.
                        </div>
                     )}
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="float-right"
                      onClick={handleSavePassword}
                      disabled={!canSavePassword}
                    >
                       Atualizar Senha
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFICAÇÃO */}
            {activeTab === "verificacao" && (
              <div className="h-full flex flex-col items-center justify-center animate-fade-in py-12">
                 <Shield className="w-16 h-16 text-gray-700 mb-6" />
                 <h2 className="text-2xl font-display text-white uppercase tracking-widest mb-4">
                   Verificação de Perfil
                 </h2>
                 <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-8 text-center max-w-sm leading-relaxed">
                   Obtenha um selo oficial atestando a autenticidade da sua coleção perante a comunidade.
                 </p>
                 <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-widest clip-diagonal-btn cursor-not-allowed">
                   Em breve
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1c1c] max-w-md w-full clip-diagonal border-l-4 p-8 relative shadow-2xl"
               style={{ borderLeftColor: '#eab308' }}
          >
            <h3 className="text-3xl font-display text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              Atenção!
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed font-sans">
              Você está prestes a alterar seu username de <strong className="text-white">@{user.username}</strong> para <strong className="text-white">@{username}</strong>.
            </p>
            <p className="text-yellow-500/90 text-sm mb-8 leading-relaxed font-bold">
              Após a confirmação, você não poderá alterar seu nome de usuário novamente por 30 dias.
            </p>
            <p className="text-gray-400 text-sm mb-8 font-sans">
              Tem certeza que deseja continuar?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUsernameChange}
                className="px-6 py-2 text-sm font-bold text-black uppercase tracking-widest clip-diagonal-btn transition-colors bg-monster-neon hover:bg-white"
              >
                Confirmar Troca
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};
