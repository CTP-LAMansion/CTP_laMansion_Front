import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar las cookies
import { UDP } from '../types/Types';

const api = axios.create({
  baseURL: 'https://ctplamansion-production.up.railway.app/api',
});

// Interceptor para agregar el token JWT a cada solicitud
api.interceptors.request.use(config => {
  const token = Cookies.get('token'); // Obtener el token desde las cookies
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener todas las UDPs con información del usuario
export const getUDPs = async (): Promise<UDP[]> => {
  try {
    const response = await api.get('/UDP');
    const udps = Array.isArray(response.data) ? response.data : [];

    // Obtener información del usuario para cada UDP
    const udpsWithUserInfo = await Promise.all(
      udps.map(async (udp) => {
        const userResponse = await api.get(`/User/${udp.userId}`);
        return {
          ...udp,
          userName: userResponse.data.name,
          userLastName: userResponse.data.lastName,
          userLastName2: userResponse.data.lastName2,
          userphoneNumber:userResponse.data.phoneNumber,
          useremail:userResponse.data.email,
        };
      })
    );

    return udpsWithUserInfo;
  } catch (error) {
    console.error("Error al obtener UDPs:", error);
    return [];
  }
};

// Obtener una UDP por su ID
export const getUDPById = async (id: number): Promise<UDP | null> => {
  try {
    const response = await api.get(`/UDP/${id}`);
    const udp = response.data;

    // Obtener información del usuario asociado a la UDP
    const userResponse = await api.get(`/User/${udp.userId}`);
    return {
      ...udp,
      userName: userResponse.data.name,
      userLastName: userResponse.data.lastName,
      userLastName2: userResponse.data.lastName2,
      userphoneNumber:userResponse.data.phoneNumber,
      useremail:userResponse.data.email,
    };
  } catch (error) {
    console.error(`Error al obtener UDP con ID ${id}:`, error);
    return null;
  }
};

// Actualizar el balance de una UDP (PATCH)
export const patchUDPBalance = async (id: number, newBalance: number): Promise<UDP> => {
  const patchData = [
    {
      "path": "/balance", 
      "op": "replace",     
      "value": newBalance   
    }
  ];

  try {
    const response = await api.patch(`/UDP/${id}`, patchData, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el balance de la UDP con ID ${id}:`, error);
    throw error;
  }
};

// Interfaces para actualizar el balance
export interface BalanceUpdateDto {
  amount: number;
  description: string;
  transactionType: string;
}

// Actualizar el balance de una UDP con el nuevo endpoint (POST)
export const updateUDPBalance = async (id: number, balanceUpdate: BalanceUpdateDto): Promise<UDP> => {
  try {
    const response = await api.post(`/UDP/${id}/balance`, balanceUpdate);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el balance de la UDP con ID ${id}:`, error);
    throw error;
  }
};

// Crear nueva UDP
export const addUDP = async (udp: Omit<UDP, 'id_UDP'>): Promise<UDP> => {
  try {
    const response = await api.post('/UDP', udp);
    return response.data;
  } catch (error) {
    console.error("Error al agregar UDP:", error);
    throw error;
  }
};

// Actualizar una UDP (PUT)
export const editUDP = async (id: number, udp: UDP): Promise<UDP> => {
  try {
    const response = await api.put(`/UDP/${id}`, udp);
    return response.data;
  } catch (error) {
    console.error("Error al editar UDP:", error);
    throw error;
  }
};

// Eliminar una UDP
export const deleteUDP = async (id: number): Promise<void> => {
  try {
    await api.delete(`/UDP/${id}`);
  } catch (error) {
    console.error("Error al eliminar UDP:", error);
    throw error;
  }
};