import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { CanDetail } from './pages/CanDetail';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { UserAchievements } from './pages/UserAchievements';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotificationsPage } from './pages/Notifications';
import { AdminRoute } from './components/AdminRoute';
import { AdminCatalog } from './pages/admin/AdminCatalog';
import { AdminGamification } from './pages/admin/AdminGamification';
import { AdminVerifications } from './pages/admin/AdminVerifications';
import { Settings } from './pages/Settings';
import { DataLab } from './pages/DataLab';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-monster-dark text-monster-white">
            <Toaster position="bottom-right" />
            <Navbar />
            <main className="flex-1 flex flex-col relative z-10 w-full pt-16 mb-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:id" element={<CanDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/u/:username" element={<Profile />} />
                <Route path="/u/:username/achievements" element={<UserAchievements />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/admin/catalog" element={<AdminRoute><AdminCatalog /></AdminRoute>} />
                <Route path="/admin/gamification" element={<AdminRoute><AdminGamification /></AdminRoute>} />
                <Route path="/admin/verifications" element={<AdminRoute><AdminVerifications /></AdminRoute>} />
                <Route path="/admin/data-lab" element={<AdminRoute><DataLab /></AdminRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
