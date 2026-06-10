import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Fonction utilitaire pour récupérer le token JWT du localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ticketService = {
  // Récupérer les statistiques et les tickets récents du demandeur connecté
  getDashboardData: async () => {
    try {
      // Dans votre Laravel, cet endpoint retournera les compteurs et la liste
      const response = await axios.get(`${API_URL}/client/dashboard`, getAuthHeaders());
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: "Impossible de charger le tableau de bord" };
    }
  }
};