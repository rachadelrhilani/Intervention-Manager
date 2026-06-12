import axios from 'axios';

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. À la réception de la réponse : si erreur 401, on déconnecte !
api.interceptors.response.use(
  (response) => response, // Si tout va bien, on laisse passer
  (error) => {
    // Si le serveur renvoie 401 (Token expiré ou invalide)
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée (Token JWT invalide). Redirection...");
      
      // Nettoyage du localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role'); // si vous stockez le rôle
      
      // Redirection brutale mais efficace vers le login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;