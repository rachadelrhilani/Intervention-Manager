import axios from 'axios';
import api from './api';
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
    // Recuperer les données du tableau de bord
    getDashboardData: async () => {
        try {
            const response = await api.get('/client/dashboard'); // Plus besoin de getAuthHeaders() !
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Impossible de charger le tableau de bord" };
        }
    },

    // Recuperer tous les tickets
    getAllTickets: async () => {
        try {
            const response = await api.get('/client/tickets');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Impossible de charger la liste des tickets" };
        }
    },

    // Creer un nouveau ticket
    createTicket: async (ticketData) => {
        try {
            const response = await api.post('/client/tickets', ticketData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Erreur lors de l'envoi du ticket" };
        }
    },
    getTicketDetails: async (ticketId) => {
        const response = await api.get(`/client/tickets/${ticketId}`);
        return response.data; // Doit renvoyer les infos du ticket de base
    },

    getCommentaires: async (ticketId) => {
        const response = await api.get(`/client/tickets/${ticketId}/commentaires`);
        return response.data;
    },

    postCommentaire: async (ticketId, texte) => {
        const response = await api.post(`/client/tickets/${ticketId}/commentaires`, { texte });
        return response.data;
    },


    // Traiteur
    getTechDashboardStats: async () => {
        try {
            const response = await api.get('/traiteur/dashboard-stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Impossible de charger les indicateurs de performance." };
        }
    },
    getTechInbox: async () => {
        try {
            const response = await api.get('/traiteur/inbox');
            return response.data; // Renvoie la réponse du serveur (contient .data)
        } catch (error) {
            throw error.response?.data || { message: "Impossible de charger la file d'attente du traiteur" };
        }
    },
    // 1. Récupérer les détails d'un incident spécifique
    getTicketById: async (id) => {
        const response = await api.get(`/traiteur/tickets/${id}`);
        return response.data; // Renvoie { status: 'success', data: {...} }
    },

    // 2. Envoyer un nouveau message sur le tchat
    sendTicketMessage: async (id, messageText) => {
        const response = await api.post(`/traiteur/tickets/${id}/messages`, { message: messageText });
        return response.data;
    },

    // 3. Clôturer définitivement le ticket avec sa checklist
    resolveTicket: async (id, checklist) => {
        const response = await api.post(`/traiteur/tickets/${id}/resolve`, { checklist });
        return response.data;
    }
};
