
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const SignUp = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
        nom_entreprise: '',
        numero_tva: '',
        contact_prefere: 'email'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // ← PREMIÈRE LIGNE
        
        setLoading(true);
        setFieldErrors({});

        const dataToSend = {
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            nom_entreprise: formData.nom_entreprise,
            numero_tva: formData.numero_tva,
            contact_prefere: formData.contact_prefere
        };
        
        console.log('Données envoyées à Laravel:', dataToSend);

        const result = await register(dataToSend);

        if (result.success) {
            navigate('/demandeur/dashboard');
        } else if (result.errors) {
            setFieldErrors(result.errors);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Créer un compte
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Inscrivez-vous pour demander une intervention
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nom complet */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Jean Dupont"
                            />
                            {fieldErrors.nom && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.nom}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="jean@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="06 12 34 56 78"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mot de passe *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Confirmation mot de passe */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {fieldErrors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Nom entreprise (optionnel) */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nom de l'entreprise (optionnel)
                            </label>
                            <input
                                type="text"
                                name="nom_entreprise"
                                value={formData.nom_entreprise}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="OCP"
                            />
                        </div>

                        {/* TVA (optionnel) */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Numéro TVA (optionnel)
                            </label>
                            <input
                                type="text"
                                name="numero_tva"
                                value={formData.numero_tva}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="FR123456789"
                            />
                        </div>

                        {/* Contact préféré */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Contact préféré
                            </label>
                            <select
                                name="contact_prefere"
                                value={formData.contact_prefere}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="email">Email</option>
                                <option value="telephone">Téléphone</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                        * Champs obligatoires
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Inscription...' : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;