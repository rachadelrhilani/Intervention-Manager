import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Pages Publiques
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';

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

        {/* --- PREPARATION DES ROUTES PRIVEES (PROTÉGÉES) --- */}
        {/* Plus tard, nous ajouterons ici les espaces connectés. 
          Exemple :
          <Route path="/demandeur" element={<DemandeurProtectedRoute />}>
             <Route path="dashboard" element={<ClientDashboard />} />
          </Route>
        */}

        {/* Redirection automatique si la page demandée n'existe pas (Erreur 404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}