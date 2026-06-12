import axios from 'axios';
import api from './api';
const API_URL = 'http://localhost:8000/api'; 

export const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Une erreur réseau est survenue" };
    }
  },

  // Appel API pour la connexion
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data; // Retourne { status, user, access_token }
    } catch (error) {
      throw error.response?.data || { message: "Identifiants incorrects ou panne serveur" };
    }
  },

  logout: async () => {
    try {
      // On utilise 'api' pour que le token soit envoyé automatiquement dans les Headers
      const response = await api.post('/logout'); 
      
      // On nettoie le localStorage immédiatement après l'appel
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
      
      return response.data;
    } catch (error) {
      // Même si le serveur a un problème, on force le nettoyage local par sécurité
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
      throw error.response?.data || { message: "Erreur lors de la déconnexion" };
    }
  }
};