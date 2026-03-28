import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-24 text-center text-monster-neon font-display tracking-widest uppercase">Decodificando Acesso...</div>;
  }

  if (!user || user.role !== "admin") {
    toast.error("Acesso Negado. Credenciais de Administrador Exigidas.", {
      style: {
        background: '#0a0a0a',
        color: '#cc0000',
        border: '1px solid #cc0000',
        borderRadius: '0',
        fontFamily: '"Rajdhani", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      iconTheme: {
        primary: '#cc0000',
        secondary: '#0a0a0a',
      },
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
