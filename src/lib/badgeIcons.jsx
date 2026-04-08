import React from 'react';

export const BADGE_ICONS = {
  "Curioso": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3dff3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="7" />
      <path d="M9 22l-0-6 M9 22l3-3 3 3V15.5" transform="translate(0 1)" />
    </svg>
  ),
  "Iniciante": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="7" />
      <circle cx="12" cy="9" r="2.5" fill="#00d4ff" />
      <path d="M9 22l-0-6 M9 22l3-3 3 3V15.5" transform="translate(0 1)" />
    </svg>
  ),
  "Colecionador": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4d7cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="7" />
      <path d="M8 9l3 3 5-5" />
      <path d="M9 22l-0-6 M9 22l3-3 3 3V15.5" transform="translate(0 1)" />
    </svg>
  ),
  "Viciado": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="8" />
      <circle cx="12" cy="9" r="4" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M9 22l-0-6 M9 22l3-3 3 3V15.5" transform="translate(0 1)" />
    </svg>
  ),
  "Fã de Carteirinha": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f72585" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="8" />
      <path d="M12 5l1.5 3h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill="#f72585" strokeWidth="1.5" transform="scale(0.7) translate(5 3)" />
      <path d="M9 22l-0-6 M9 22l3-3 3 3V15.5" transform="translate(0 1)" />
    </svg>
  ),
  "Caçador de Edições": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" />
    </svg>
  ),
  "Meio Milhar": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#ffd700" fillOpacity="0.2" />
      <circle cx="12" cy="12.25" r="9" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#ffd700" fillOpacity="0.5" />
    </svg>
  ),
  "1K Monster": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff2020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12.25" r="9" fill="#ff2020" fillOpacity="0.5" />
      <path d="M12 7l1.5 3.5h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill="#ff2020" transform="scale(0.4) translate(18 18)" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fillOpacity="0" stroke="#c70000" />
    </svg>
  ),
  "Garagem Cheia": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12.25" r="8" stroke="#00caa3" fill="#00ffcc" fillOpacity="0" strokeWidth="2.5" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#00ffcc" stroke="#008a6f" strokeWidth="3" opacity="1" fillOpacity="0.2" transform="scale(0.9) rotate(180 12.5 10) translate(0 -6)" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#008a6f" stroke="#00ffcc" fillOpacity="0.5" />
      <path d="M12 7l1.5 3.5h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" stroke="#88ffe7" fill="#88ffe7" transform="scale(0.5) translate(12 12)" />
    </svg>
  ),
  "Estoque Pessoal": (
    <svg width="36" height="40" viewBox="0 0 24 24" fill="none" stroke="#dedede" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 22l-0-7 M9 22l3-3 3 3V15.5" transform="translate(0 2.2)" />
      <circle cx="12" cy="12.25" r="9" stroke="#dddddd" fill="#000" fillOpacity="0" strokeWidth="2.5" transform="translate(0 -2)" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#fff" stroke="#6c6c6c" strokeWidth="3" opacity="1" fillOpacity="0.2" transform="scale(0.9) rotate(180 12.7 12)" />
      <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" fill="#6c6c6c" stroke="#dedede" fillOpacity="0.5" transform="translate(0 -2)" />
      <path d="M12 7l1.5 3.5h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" stroke="#ffffff" fill="#ffffff" transform="scale(0.5) translate(12 8)" />
    </svg>
  ),
  "Curador": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aaff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" />
    </svg>
  ),
  "Museu Verde": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11.5" r="3.5" />
    </svg>
  ),
  "Lendário": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff4df7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ff4df7" fillOpacity="0.15" />
      <path d="M12 18s4-2 4-5V8l-4-1.5-4 1.5v5c0 3 4 5 4 5z" strokeWidth="2" />
    </svg>
  ),
  "Patrimônio Cultural": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff6e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ff6e6e" fillOpacity="0.15" />
      <path d="M12 8l3 4-3 4-3-4z" />
    </svg>
  ),
  "Rei da Coleção": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffb700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ffb700" fillOpacity="0.2" />
      <path d="M12 20 L12 14 L15.5 17 L18 13 L20.5 17 L24 14 L24 20 Z" stroke="#ffb700" fill="#ffb700" fillOpacity="1" strokeWidth="1.2" transform="scale(0.8) translate(-3 -2)" />
    </svg>
  ),
  "Obsessão Total": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a8f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 18s4-2 4-5V8l-4-1.5-4 1.5v5c0 3 4 5 4 5z" strokeWidth="2" />
      <path d="M9 14l3-2 3 2v2H9v-2z" strokeWidth="1" fill="#a8f0ff" transform="rotate(180) translate(-24 -29)" />
    </svg>
  ),
  "Monstro": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#000" fillOpacity="0.25" />
      <path d="M8 13l4-3 4 3m-8 4l4-3 4 3" strokeWidth="2.5" transform="translate(0 -2.5)" />
    </svg>
  )
};

export const ACHIEVEMENT_ICONS = {
  "Primeira lata": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="6" width="16" height="24" rx="4" stroke="#ff4444" strokeWidth="2" />
      <ellipse cx="18" cy="6" rx="8" ry="3" stroke="#ff4444" strokeWidth="2" />
      <ellipse cx="18" cy="30" rx="8" ry="3" stroke="#ff4444" strokeWidth="2" />
      <line x1="10" y1="12" x2="26" y2="12" stroke="#ff4444" strokeWidth="1.5" opacity=".45" />
      <line x1="10" y1="24" x2="26" y2="24" stroke="#ff4444" strokeWidth="1.5" opacity=".45" />
      <rect x="14" y="15" width="8" height="6" rx="1.5" stroke="#ff4444" strokeWidth="1.5" fill="#ff4444" fillOpacity=".2" />
    </svg>
  ),
  "Trio de sabores": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 22 Q7 14 11 11 Q15 8 15 14 Q15 20 7 22 Z" stroke="#44dd88" strokeWidth="2" />
      <path d="M21 22 Q21 14 25 11 Q29 8 29 14 Q29 20 21 22 Z" stroke="#44dd88" strokeWidth="2" />
      <path d="M14 31 Q14 24 18 21 Q22 18 22 25 Q22 31 14 31 Z" stroke="#44dd88" strokeWidth="2" fill="#44dd88" fillOpacity=".2" />
    </svg>
  ),
  "Caçador de latas": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="11" stroke="#00d4ff" strokeWidth="2" />
      <circle cx="18" cy="18" r="6" stroke="#00d4ff" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2.5" fill="#00d4ff" />
      <line x1="18" y1="4" x2="18" y2="8" stroke="#00d4ff" strokeWidth="2" />
      <line x1="18" y1="28" x2="18" y2="32" stroke="#00d4ff" strokeWidth="2" />
      <line x1="4" y1="18" x2="8" y2="18" stroke="#00d4ff" strokeWidth="2" />
      <line x1="28" y1="18" x2="32" y2="18" stroke="#00d4ff" strokeWidth="2" />
    </svg>
  ),
  "Edição limitada": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 4 L30 14 L18 34 L6 14 Z" stroke="#ffd700" strokeWidth="2" fill="#ffd700" fillOpacity=".15" />
      <path d="M6 14 L18 14 L30 14" stroke="#ffd700" strokeWidth="1.5" opacity=".5" />
      <path d="M12 8 L18 14 L24 8" stroke="#ffd700" strokeWidth="1.5" opacity=".5" />
    </svg>
  ),
  "Monstro social": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="7" r="4" stroke="#a855f7" strokeWidth="2" />
      <circle cx="6" cy="28" r="4" stroke="#a855f7" strokeWidth="2" />
      <circle cx="30" cy="28" r="4" stroke="#a855f7" strokeWidth="2" />
      <line x1="18" y1="11" x2="10" y2="24" stroke="#a855f7" strokeWidth="2" />
      <line x1="18" y1="11" x2="26" y2="24" stroke="#a855f7" strokeWidth="2" />
      <line x1="10" y1="24" x2="26" y2="24" stroke="#a855f7" strokeWidth="1.5" opacity=".5" />
    </svg>
  ),
  "Influenciador": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="19" x2="18" y2="33" stroke="#00ffcc" strokeWidth="2" />
      <path d="M13 31 L18 33 L23 31" stroke="#00ffcc" strokeWidth="2" />
      <path d="M12 16 Q12 10 18 10 Q24 10 24 16" stroke="#00ffcc" strokeWidth="2" fill="none" />
      <path d="M7 12 Q7 4 18 4 Q29 4 29 12" stroke="#00ffcc" strokeWidth="2" fill="none" opacity=".45" />
      <circle cx="18" cy="19" r="3" stroke="#00ffcc" strokeWidth="2" />
    </svg>
  ),
  "Lata fantasma": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 32 L8 16 Q8 6 18 6 Q28 6 28 16 L28 32 L24 28 L21 32 L18 28 L15 32 L12 28 Z" stroke="#c0c0c0" strokeWidth="2" fill="#c0c0c0" fillOpacity=".1" />
      <circle cx="14" cy="18" r="2.5" fill="#c0c0c0" fillOpacity=".6" />
      <circle cx="22" cy="18" r="2.5" fill="#c0c0c0" fillOpacity=".6" />
      <path d="M14 24 Q18 27 22 24" stroke="#c0c0c0" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  "Colecionador lendário": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6 L24 6 L24 20 Q24 28 18 28 Q12 28 12 20 Z" stroke="#ffb700" strokeWidth="2" fill="#ffb700" fillOpacity=".15" />
      <path d="M6 8 L12 8 L12 16 Q6 16 6 10 Z" stroke="#ffb700" strokeWidth="2" fill="none" />
      <path d="M30 8 L24 8 L24 16 Q30 16 30 10 Z" stroke="#ffb700" strokeWidth="2" fill="none" />
      <line x1="15" y1="28" x2="15" y2="32" stroke="#ffb700" strokeWidth="2" />
      <line x1="21" y1="28" x2="21" y2="32" stroke="#ffb700" strokeWidth="2" />
      <line x1="11" y1="32" x2="25" y2="32" stroke="#ffb700" strokeWidth="2" />
    </svg>
  ),
  "Troca de latas": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18 Q8 9 18 9 L26 9" stroke="#4d7cff" strokeWidth="2" fill="none" />
      <path d="M22 5 L26 9 L22 13" stroke="#4d7cff" strokeWidth="2" fill="none" />
      <path d="M28 18 Q28 27 18 27 L10 27" stroke="#4d7cff" strokeWidth="2" fill="none" />
      <path d="M14 23 L10 27 L14 31" stroke="#4d7cff" strokeWidth="2" fill="none" />
    </svg>
  ),
  "Energizado": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 L9 20 L17 20 L15 33 L27 16 L19 16 Z" stroke="#ff6b00" strokeWidth="2" fill="#ff6b00" fillOpacity=".2" />
    </svg>
  ),
  "Ultra rara": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 3 L26 13 L18 34 L10 13 Z" stroke="#00d4ff" strokeWidth="2" fill="#00d4ff" fillOpacity=".12" />
      <path d="M10 13 L18 13 L26 13" stroke="#00d4ff" strokeWidth="1.5" opacity=".5" />
      <path d="M13 7 L18 13 L23 7" stroke="#00d4ff" strokeWidth="1.5" opacity=".5" />
    </svg>
  ),
  "Atlas do Monster": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="13" stroke="#44dd88" strokeWidth="2" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#44dd88" strokeWidth="1.5" opacity=".6" />
      <line x1="5" y1="13" x2="31" y2="13" stroke="#44dd88" strokeWidth="1.5" opacity=".45" />
      <line x1="5" y1="23" x2="31" y2="23" stroke="#44dd88" strokeWidth="1.5" opacity=".45" />
    </svg>
  )
};

export const ACHIEVEMENT_COLORS = {
  "Primeira lata": "#ff4444",
  "Trio de sabores": "#44dd88",
  "Caçador de latas": "#00d4ff",
  "Edição limitada": "#ffd700",
  "Monstro social": "#a855f7",
  "Influenciador": "#00ffcc",
  "Lata fantasma": "#c0c0c0",
  "Colecionador lendário": "#ffb700",
  "Troca de latas": "#4d7cff",
  "Energizado": "#ff6b00",
  "Ultra rara": "#00d4ff",
  "Atlas do Monster": "#44dd88"
};