import api from './api';
export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/users', userData);
    return response.data; // Devuelve el usuario creado
  } catch (error: any) {
    throw error.response?.data || { message: 'Error desconocido' };
  }
};
