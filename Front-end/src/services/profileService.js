import api from './api';

export const profileService = {
  /**
   * Met à jour les informations du profil utilisateur connecté.
   * @param {Object} profileData 
   * @returns {Promise<Object>}
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile/update', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Une erreur est survenue lors de la sauvegarde du profil." };
    }
  }
};
