import Cookies from 'js-cookie';

const API_URL = 'https://ctplamansion-production.up.railway.app/api';

export const fetchUserLabRequests = async (userId: string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No se encontró el token de autenticación.');

  const response = await fetch(`${API_URL}/LaboratoryRequest/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Error al obtener solicitudes de laboratorio');
  return await response.json();
};

export const fetchUserRoomRequests = async (userId: string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No se encontró el token de autenticación.');

  const response = await fetch(`${API_URL}/RoomRequest/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Error al obtener solicitudes de salas');
  return await response.json();
};

// Nueva función para obtener solicitudes de órdenes
export const fetchUserOrders = async (userId: string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No se encontró el token de autenticación.');

  const response = await fetch(`${API_URL}/Order/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Error al obtener solicitudes de órdenes');
  return await response.json();
};
