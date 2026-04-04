export const getBadgeInfo = (count) => {
  if (count <= 0) return null;
  
  const thresholds = [
    { count: 10000, name: "Monstro", label: "10K" },
    { count: 9000, name: "Obsessão Total", label: "9K+" },
    { count: 8000, name: "Rei da Coleção", label: "8K+" },
    { count: 7000, name: "Patrimônio Cultural", label: "7K+" },
    { count: 6000, name: "Lendário", label: "6K+" },
    { count: 5000, name: "Museu Verde", label: "5K+" },
    { count: 4000, name: "Curador", label: "4K+" },
    { count: 3000, name: "Estoque Pessoal", label: "3K+" },
    { count: 2000, name: "Garagem Cheia", label: "2K+" },
    { count: 1000, name: "1K Monster", label: "1K+" },
    { count: 500, name: "Meio Milhar", label: "500+" },
    { count: 250, name: "Caçador de Edições", label: "250+" },
    { count: 100, name: "Fã de Carteirinha", label: "100+" },
    { count: 50, name: "Viciado", label: "50+" },
    { count: 25, name: "Colecionador", label: "25+" },
    { count: 10, name: "Iniciante", label: "10+" },
    { count: 1, name: "Curioso", label: "1+" }
  ];

  for (let t of thresholds) {
    if (count >= t.count) {
      return { name: t.name, count: t.count, label: t.label };
    }
  }

  return null; // Should not reach here if count > 0
};

export const getBadgeStyle = (badgeName) => {
  const styles = {
    "Curioso": { bg: "#0a1a0a", border: "#1a3d1a", accent: "#3dff3d" },
    "Iniciante": { bg: "#041418", border: "#0a2e38", accent: "#00d4ff" },
    "Colecionador": { bg: "#060a1e", border: "#0e1a52", accent: "#4d7cff" },
    "Viciado": { bg: "#0e0818", border: "#2a1050", accent: "#a855f7" },
    "Fã de Carteirinha": { bg: "#160810", border: "#3d0828", accent: "#f72585" },
    "Caçador de Edições": { bg: "#160a02", border: "#3d1a00", accent: "#ff6b00" },
    "Meio Milhar": { bg: "#141000", border: "#3a2e00", accent: "#ffd700" },
    "1K Monster": { bg: "#160202", border: "#3d0606", accent: "#ff2020" },
    "Garagem Cheia": { bg: "#021410", border: "#043830", accent: "#00ffcc" },
    "Estoque Pessoal": { bg: "#121212", border: "#2e2e2e", accent: "#c0c0c0" },
    "Curador": { bg: "#0c1000", border: "#263000", accent: "#aaff00" },
    "Museu Verde": { bg: "#060818", border: "#100e40", accent: "#7c3aed" },
    "Lendário": { bg: "#140610", border: "#380828", accent: "#ff4df7" },
    "Patrimônio Cultural": { bg: "#160808", border: "#3d1010", accent: "#ff6e6e" },
    "Rei da Coleção": { bg: "#120e00", border: "#362800", accent: "#ffb700" },
    "Obsessão Total": { bg: "#020e16", border: "#042438", accent: "#a8f0ff" },
    "Monstro": { bg: "#001200", border: "#00ff00", accent: "#00ff00" }
  };

  return styles[badgeName] || { bg: "#121212", border: "#2e2e2e", accent: "#ffffff" };
};
