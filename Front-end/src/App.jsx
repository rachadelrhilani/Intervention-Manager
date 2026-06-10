import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages Publiques
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';

// Pages Clients
import ClientDashboard from './pages/demandeur/ClientDashboard';
import CreateTicket from './pages/demandeur/CreateTicket';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ROUTES PUBLIQUES --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route path="/client" element={<DashboardLayout />}>
          {/* Redirige par défaut /client vers le dashboard */}
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          
          {/* Composants temporaires en attendant la suite de la Phase 3 */}
          <Route path="dashboard" element={<ClientDashboard/>} />
          <Route path="nouveau-ticket" element={<CreateTicket />} />
          <Route path="tickets" element={<div className="text-2xl font-bold">Historique de vos demandes</div>} />
        </Route>

        {/* Sécurité Globale 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}