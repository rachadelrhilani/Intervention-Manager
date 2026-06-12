import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService'; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);

  // 1. Initialisation de l'utilisateur au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erreur de lecture de user_data", e);
        handleLogout(); // Nettoyage en cas de données corrompues
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // 💡 2. SÉCURITÉ : Écouteur global pour intercepter l'expiration du Token (géré par api.js)
  useEffect(() => {
    const syncLogout = (event) => {
      // Si le token est supprimé du localStorage (par notre intercepteur Axios),
      // on force immédiatement la mise à jour des états de React
      if (event.key === 'jwt_token' && !event.newValue) {
        console.warn("Token expiré détecté par le Context. Reset des états.");
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  // Connexion réussie
  const handleLogin = (authData) => {
    const accessToken = authData.access_token;
    const userData = authData.user;

    localStorage.setItem('jwt_token', accessToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    setToken(accessToken);
    setUser(userData);

    return userData.role;
  };

  // 💡 3. Déconnexion améliorée (Prise en compte du Backend + Frontend)
  const handleLogout = async () => {
    try {
      // On tente d'avertir Laravel pour invalider le token côté serveur
      await authService.logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion backend :", err);
    } finally {
      // 🛡️ Quoi qu'il arrive (succès ou échec api), on nettoie impérativement le frontend
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}