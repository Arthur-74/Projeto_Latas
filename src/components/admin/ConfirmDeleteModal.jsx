import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, monsterName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-monster-dark/80 backdrop-blur-sm p-4">
      <div className="bg-monster-gray border border-monster-red/50 max-w-md w-full p-6 clip-diagonal shadow-[0_0_20px_rgba(204,0,0,0.3)]">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-monster-red drop-shadow-[0_0_8px_rgba(204,0,0,0.8)]" />
          <h2 className="text-2xl font-display text-white tracking-widest uppercase">Excluir Lata?</h2>
          <p className="font-body text-gray-300">
            Você está prestes a deletar permanentemente <span className="text-monster-red font-bold uppercase tracking-wider">{monsterName}</span> do catálogo. Esta ação é irreversível.
          </p>
          <div className="flex gap-4 w-full pt-4 font-display">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button 
              className="flex-1 bg-monster-red hover:bg-red-600 text-white border-none shadow-[0_0_12px_rgba(204,0,0,0.5)]" 
              onClick={onConfirm}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
