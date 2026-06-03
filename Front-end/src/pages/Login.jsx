// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Formulaire soumis');
        setLoading(true);
        setLocalError('');

        const result = await login(formData);

        if (result.success) {
            // Rediriger selon le rôle
            const role = result.user.role;
            if (role === 'demandeur') navigate('/demandeur/dashboard');
            else if (role === 'technicien') navigate('/technicien/dashboard');
            else if (role === 'administrateur') navigate('/admin/dashboard');
            else navigate('/');
        } else {
            setLocalError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Logo / Titre */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Plateforme d'Interventions
                    </h1>
                    <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
                </div>

                {/* Message d'erreur */}
                {(localError || error) && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {localError || error}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                {/* Lien vers inscription */}
                <p className="text-center text-gray-600 mt-6">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;