import React, { useState, useEffect } from "react";
import { measureLocalStorage } from "../../lib/itemUtils";
import { Database, AlertTriangle } from "lucide-react";

export const StorageMonitor = () => {
   const [usage, setUsage] = useState({ usedMb: 0, maxMb: 5, percentage: 0 });

   useEffect(() => {
     const updateUsage = () => {
        setUsage(measureLocalStorage());
     };
     
     updateUsage();
     // Update on any storage change or click to refresh
     window.addEventListener("storage", updateUsage);
     const interval = setInterval(updateUsage, 3000);
     return () => {
        window.removeEventListener("storage", updateUsage);
        clearInterval(interval);
     };
   }, []);

   const isCritical = usage.percentage >= 90;
   const isWarning = usage.percentage >= 70 && !isCritical;

   return (
     <div className={`p-4 border clip-diagonal flex items-center justify-between gap-6 transition-all ${
        isCritical ? "bg-red-900/20 border-monster-red" : 
        isWarning ? "bg-yellow-900/20 border-yellow-500" : "bg-[#1c1c1c] border-white/10"
     }`}>
        <div className="flex items-center gap-3">
           <Database className={`w-5 h-5 ${isCritical ? "text-monster-red" : isWarning ? "text-yellow-500" : "text-monster-neon"}`} />
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Uso de Memória Local</p>
              <div className="flex items-center gap-2">
                 <span className={`font-display text-xl ${isCritical ? "text-monster-red" : "text-white"}`}>
                    {usage.usedMb}
                 </span>
                 <span className="text-sm text-gray-500">/ {usage.maxMb} MB</span>
              </div>
           </div>
        </div>

        <div className="flex-1 max-w-xs">
           <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
              <span>{usage.percentage}%</span>
              {isCritical && <span className="text-monster-red flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Crítico</span>}
              {isWarning && <span className="text-yellow-500">Atenção</span>}
           </div>
           <div className="h-2 w-full bg-black border border-white/5">
              <div 
                 className={`h-full ${isCritical ? "bg-monster-red shadow-[0_0_8px_rgba(204,0,0,0.8)]" : isWarning ? "bg-yellow-500" : "bg-monster-neon shadow-[0_0_8px_rgba(57,255,20,0.8)]"}`}
                 style={{ width: `${usage.percentage}%` }}
              />
           </div>
        </div>
     </div>
   );
};
