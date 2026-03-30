import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { CanCard } from "../components/CanCard";
import { Button } from "../components/ui/Button";
import { AchievementsCard } from "../components/AchievementsCard";
import { updateAchievementProgress } from "../lib/achievementsApi";
import { UserCheck, Shield, Camera, Trash2, Heart, X } from "lucide-react";
import { ImageCropModal } from "../components/ImageCropModal";
import toast from "react-hot-toast";

export const Profile = () => {
  const { username } = useParams();
  const { monsters } = useAppData();
  const { user, updateUserProfileImage, toggleFavorite } = useAuth();
  
  const isOwner = user?.username === username;

  // Modals & Cropper state
  const [cropType, setCropType] = useState(null); // 'avatar' | 'banner'
  const [imageSrc, setImageSrc] = useState(null);
  
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // MOCK: Generate a deterministic mock user profile for any username
  const mockCollectionCount = (username.length * 7) % monsters.length || 5;
  const mockCollection = monsters.slice(0, mockCollectionCount);
  const pct = Math.round((mockCollectionCount / monsters.length) * 100);

  const displayFavorites = isOwner 
    ? (user?.favorites || []).map(id => monsters.find(m => m.id === id)).filter(Boolean)
    : mockCollection.slice(0, 3); // mock some favorites for others

  // Use state or props depending if looking at self
  const displayAvatar = isOwner && user.avatarUrl ? user.avatarUrl : null;
  const displayBanner = isOwner && user.bannerUrl ? user.bannerUrl : null;

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const MAX_SIZE = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
      
      if (file.size > MAX_SIZE) {
        toast.error(`A imagem excedeu o limite de ${MAX_SIZE / 1024 / 1024}MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || "");
        setCropType(type);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedBase64) => {
    updateUserProfileImage(cropType, croppedBase64);
    toast.success(`${cropType === 'avatar' ? 'Avatar' : 'Banner'} atualizado com sucesso!`);
    setImageSrc(null);
    setCropType(null);
    // Reset inputs
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  };

  const removeAvatar = (e) => {
    e.stopPropagation();
    updateUserProfileImage("avatar", "");
    toast.success("Avatar removido.");
  };

  const removeBanner = (e) => {
    e.stopPropagation();
    updateUserProfileImage("banner", "");
    toast.success("Banner removido.");
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Banner */}
      <div 
         className={`h-64 md:h-80 w-full relative bg-monster-dark overflow-hidden border-b border-monster-neon/20 transition-all ${isOwner ? "group cursor-pointer" : ""}`}
         onClick={() => isOwner && bannerInputRef.current.click()}
      >
        {displayBanner ? (
          <img src={displayBanner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 noise-bg">
             <span className="text-[12rem] font-display text-monster-neon glow-text uppercase font-bold tracking-[0.5em] ml-[0.5em]">
               {username}
             </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-monster-dark to-transparent" />
        
        {isOwner && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
             <div className="flex flex-col items-center">
               <Camera className="h-10 w-10 text-monster-neon mb-2 drop-shadow-[0_0_8px_#39ff14]" />
               <span className="text-white font-display uppercase tracking-widest text-lg">Alterar Banner</span>
             </div>
             {displayBanner && (
               <Button 
                 variant="outline" size="sm" 
                 className="absolute top-4 right-4 bg-black/50 text-monster-red border-monster-red hover:bg-monster-red hover:text-white"
                 onClick={removeBanner}
               >
                 <Trash2 className="h-4 w-4 mr-2" /> Remover
               </Button>
             )}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-12">
          
          <div 
            className={`w-40 h-40 rounded-full border-4 border-monster-dark bg-monster-gray flex items-center justify-center glow-border shadow-2xl relative overflow-hidden ${isOwner ? "group cursor-pointer" : ""}`}
            onClick={() => isOwner && avatarInputRef.current.click()}
          >
             {displayAvatar ? (
               <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <span className="text-6xl font-display text-white uppercase">{username.charAt(0)}</span>
             )}
             
             {/* Badge Admin */}
             {user?.role === "admin" && isOwner && (
               <div className="absolute bottom-1 right-1 bg-monster-neon text-monster-dark p-1 rounded-full z-20">
                 <Shield className="h-5 w-5" />
               </div>
             )}

             {isOwner && (
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity z-10">
                 <Camera className="h-8 w-8 text-monster-neon mb-1 drop-shadow-[0_0_8px_#39ff14]" />
                 <span className="text-white font-display uppercase tracking-widest text-xs">Alterar Foto</span>
                 {displayAvatar && (
                   <div 
                     className="mt-2 text-monster-red bg-monster-dark/80 p-1 rounded-full hover:bg-monster-red hover:text-white"
                     onClick={removeAvatar}
                   >
                     <Trash2 className="h-4 w-4" />
                   </div>
                 )}
               </div>
             )}
          </div>

          <div className="flex-1 space-y-2 mb-4 md:mb-0">
             <h1 className="text-4xl md:text-5xl font-display uppercase tracking-widest text-white mt-4 md:mt-0">
               {username}
             </h1>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-sm flex gap-4">
               <span>Progresso Real: <span className="text-monster-neon">{pct}%</span></span>
               <span>•</span>
               <span>Latas: {mockCollectionCount}</span>
             </p>
          </div>
          
          <div className="mb-4">
             <Button 
               className="w-full md:w-auto"
               onClick={() => {
                 toast.success(`Seguindo ${username} agora!`);
                 if (user?.id) {
                   updateAchievementProgress(user.id, "following_count", 1);
                   updateAchievementProgress(`mock-${username}`, "followers_count", 1);
                 }
               }}
             >
               <UserCheck className="mr-2 h-4 w-4" /> Seguir Perfil
             </Button>
          </div>
        </div>

        {/* Public Achievements Board */}
        <div className="mb-16">
          <AchievementsCard userId={isOwner ? user.id : `mock-${username}`} isOwner={isOwner} />
        </div>

        {/* Favorite Showcase */}
        <div className="mb-16">
          <h3 className="text-xl font-display text-white uppercase tracking-widest border-l-4 border-monster-neon pl-3 mb-6">
            Vitrine de Favoritas
          </h3>
          
          {displayFavorites.length === 0 ? (
            <div className="bg-monster-gray/30 border border-white/5 p-12 flex flex-col items-center justify-center clip-diagonal">
              <Heart className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 font-display uppercase tracking-widest">Nenhuma lata favoritada ainda.</p>
            </div>
          ) : (
            <div 
              className="flex overflow-x-auto gap-6 pb-4 snap-x relative z-20"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayFavorites.slice(0, 6).map(can => (
                <div key={`fav-${can.id}`} className="min-w-[280px] max-w-[280px] snap-center relative group">
                  <CanCard monster={can} />
                  
                  {isOwner && (
                    <button
                      onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         toggleFavorite(can.id);
                         toast("Lata removida da vitrine.");
                      }}
                      className="absolute top-2 right-2 z-50 bg-[#cc0000] text-white p-2 hover:bg-white hover:text-[#cc0000] transition-colors shadow-lg opacity-0 group-hover:opacity-100 glow-border"
                      title="Remover dos favoritos"
                    >
                      <X className="h-5 w-5 stroke-[3]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Collection grid */}
        <div className="mb-16">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-display text-white uppercase tracking-widest border-l-4 border-gray-500 pl-3">
               Coleção Completa
             </h3>
             <Link to="/catalog" className="text-sm uppercase tracking-widest font-bold text-gray-400 hover:text-monster-neon">Ver Catálogo</Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {mockCollection.map(can => (
                 <CanCard key={`all-${can.id}`} monster={can} />
               ))}
           </div>
        </div>
      </div>

      {isOwner && (
        <>
          <input type="file" ref={avatarInputRef} accept="image/jpeg, image/png, image/webp" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
          <input type="file" ref={bannerInputRef} accept="image/jpeg, image/png, image/webp" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
          
          <ImageCropModal 
            isOpen={!!imageSrc}
            imageSrc={imageSrc}
            aspect={cropType === 'avatar' ? 1 : 16/4}
            onClose={() => { setImageSrc(null); setCropType(null); }}
            onCropComplete={onCropComplete}
          />
        </>
      )}
    </div>
  );
};
