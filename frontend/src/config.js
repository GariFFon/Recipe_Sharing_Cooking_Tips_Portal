// Use environment variable for production, localhost for development
const hostname = window.location.hostname === 'localhost' ? 'localhost' : '172.28.3.83';
const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
export const BACKEND_URL = API_URL;
export const API_BASE_URL = `${BACKEND_URL}/api`;
