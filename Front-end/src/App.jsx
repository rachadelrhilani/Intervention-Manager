// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Import des dashboards (à créer)
// import DemandeurDashboard from './pages/demandeur/Dashboard';
// import TechnicienDashboard from './pages/technicien/Dashboard';
// import AdminDashboard from './pages/admin/Dashboard';

// Composants temporaires pour test
const DemandeurDashboard = () => <div className="p-8"><h1>Dashboard Demandeur</h1></div>;
const TechnicienDashboard = () => <div className="p-8"><h1>Dashboard Technicien</h1></div>;
const AdminDashboard = () => <div className="p-8"><h1>Dashboard Administrateur</h1></div>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />

                    {/* Routes protégées - Demandeur */}
                    <Route path="/demandeur" element={
                        <PrivateRoute allowedRoles={['demandeur']}>
                            <DemandeurDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/demandeur/dashboard" element={
                        <PrivateRoute allowedRoles={['demandeur']}>
                            <DemandeurDashboard />
                        </PrivateRoute>
                    } />

                    {/* Routes protégées - Technicien */}
                    <Route path="/technicien" element={
                        <PrivateRoute allowedRoles={['technicien']}>
                            <TechnicienDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/technicien/dashboard" element={
                        <PrivateRoute allowedRoles={['technicien']}>
                            <TechnicienDashboard />
                        </PrivateRoute>
                    } />

                    {/* Routes protégées - Administrateur */}
                    <Route path="/admin" element={
                        <PrivateRoute allowedRoles={['administrateur']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute allowedRoles={['administrateur']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />

                    {/* Redirection par défaut */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;