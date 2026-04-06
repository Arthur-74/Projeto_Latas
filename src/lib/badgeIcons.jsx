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