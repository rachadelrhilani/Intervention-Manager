import axios from 'axios';

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
  }
};