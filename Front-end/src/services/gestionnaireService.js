import api from './api'; // Ajuste le chemin vers ton instance Axios commune

export const gestionnaireService = {
    /**
     * Récupère les métriques clés et les alertes du Dashboard
     */
    getDashboardStats: async () => {
        const response = await api.get('/gestionnaire/dashboard-stats');
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Format de réponse invalide ou échec du serveur");
    },

    /**
     * Récupère la liste globale paginée de tous les tickets du système (getAllTickets)
     */
    getAllTickets: async (page = 1, perPage = 15) => {
        const response = await api.get(`/gestionnaire/tickets?page=${page}&per_page=${perPage}`);
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Impossible de récupérer le registre des tickets");
    },


    getAllUsers: async (page = 1, perPage = 10, search = '') => {
        const response = await api.get(`/gestionnaire/utilisateurs?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Impossible de charger la liste des utilisateurs.");
    },

    /**
     * Active ou désactive le statut d'un utilisateur
     */
    toggleUserStatus: async (userId) => {
        const response = await api.patch(`/gestionnaire/utilisateurs/${userId}/toggle-status`);
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Erreur lors de la modification du statut de l'utilisateur.");
    },

    /**
     * Crée un nouveau compte Technicien (Traiteur)
     */
    createTraiteur: async (traiteurData) => {
        const response = await api.post('/gestionnaire/utilisateurs/traiteurs', traiteurData);
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Échec de la création du compte technicien.");
    },

    getSlaConfigs: async () => {
        const response = await api.get('/gestionnaire/sla');
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Impossible de charger les configurations SLA.");
    },

    /**
     * Met à jour les seuils de temps d'une ou plusieurs priorités
     */
    updateSlaConfigs: async (slaData) => {
        const response = await api.put('/gestionnaire/sla', { sla: slaData });
        if (response.data && response.data.status === 'success') {
            return response.data.data;
        }
        throw new Error("Échec de la mise à jour des règles SLA.");
    }
};