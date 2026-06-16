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
import TicketDetail from './pages/demandeur/TicketDetail';
import TicketsList from './pages/demandeur/TicketsList';


// Pages Traiteurs
import TicketInbox from './pages/traiteur/TicketInbox';
import TicketResolve from './pages/Traiteur/TicketResolve';
import TechDashboard from './pages/traiteur/TechDashboard';

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

                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="nouveau-ticket" element={<CreateTicket />} />
                    <Route path="tickets" element={<TicketsList />} />
                    <Route path="tickets/:id" element={<TicketDetail />} />
                </Route>


                <Route path="/traiteur" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/traiteur/dashboard" replace />} />
                    <Route path="dashboard" element={<TechDashboard />} />
                              <Route path="ticket/:id" element={<TicketResolve />} />
                    <Route path="inbox" element={<TicketInbox />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}