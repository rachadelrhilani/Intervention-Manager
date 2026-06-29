import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Sécurité
import ProtectedRoute from './components/ProtectedRoute';

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
import TicketDetail from './pages/demandeur/TicketDetail';
import TicketsList from './pages/demandeur/TicketsList';

// Pages Traiteurs
import TicketInbox from './pages/traiteur/TicketInbox';
import TicketResolve from './pages/traiteur/TicketResolve';
import EscaladeTicket from './pages/Traiteur/EscaladeTicket';
import TechDashboard from './pages/traiteur/TechDashboard';

// Pages Gestionnaires
import GestionnaireDashboard from './pages/gestionnaire/GestionnaireDashboard';
import GestionnaireTicketsList from './pages/gestionnaire/GestionnaireTicketsList';
import UserManagement from './pages/gestionnaire/UserManagement';
import SlaConfig from './pages/gestionnaire/SlaConfig';
// Pages profile
import Profile from './pages/shared/Profile';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* --- 1. ROUTES PUBLIQUES (Accessibles à tous) --- */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Route>

                {/* --- 2. ZONE SÉCURISÉE CLIENTS (Rôle : demandeur) --- */}
                <Route element={<ProtectedRoute allowedRoles={['demandeur']} />}>
                    <Route path="/client" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/client/dashboard" replace />} />
                        <Route path="dashboard" element={<ClientDashboard />} />
                        <Route path="nouveau-ticket" element={<CreateTicket />} />
                        <Route path="tickets" element={<TicketsList />} />
                        <Route path="tickets/:id" element={<TicketDetail />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* --- 3. ZONE SÉCURISÉE TECHNICIENS (Rôle : traiteur) --- */}
                <Route element={<ProtectedRoute allowedRoles={['traiteur']} />}>
                    <Route path="/traiteur" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/traiteur/dashboard" replace />} />
                        <Route path="dashboard" element={<TechDashboard />} />
                        <Route path="ticket/:id" element={<TicketResolve />} />
                        <Route path="inbox" element={<TicketInbox />} />
                        <Route path="escalade" element={<EscaladeTicket />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* --- 4. ZONE SÉCURISÉE GESTIONNAIRES (Rôle : gestionnaire) --- */}
                <Route element={<ProtectedRoute allowedRoles={['gestionnaire']} />}>
                    <Route path="/gestionnaire" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/gestionnaire/dashboard" replace />} />
                        <Route path="dashboard" element={<GestionnaireDashboard />} />
                        <Route path="tickets" element={<GestionnaireTicketsList />} /> 
                        <Route path="utilisateurs" element={<UserManagement />} /> 
                        <Route path="sla" element={<SlaConfig />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* --- ROUTE PAR DÉFAUT --- */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}