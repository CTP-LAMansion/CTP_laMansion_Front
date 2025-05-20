import axios from "axios";
import Cookies from "js-cookie";
import { Laboratory } from "../types/Types";
import { LabRequest } from "../types/LaboratoryRequestType";

const API_URL = 'https://ctplamansion-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token desde cookies
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Obtén el token de las cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleResponse = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// === Funciones relacionadas con laboratorios ===

export const fetchLaboratories = (): Promise<Laboratory[]> => handleResponse<Laboratory[]>(`/Laboratory`);

export const getLaboratoryById = (id: number): Promise<Laboratory> => handleResponse<Laboratory>(`/Laboratory/${id}`);

export const addLaboratory = async (newLaboratory: Laboratory): Promise<Laboratory> => {
  try {
    const response = await apiClient.post<Laboratory>('/Laboratory', newLaboratory);
    return response.data;
  } catch (error) {
    console.error('Error adding laboratory:', error);
    throw error;
  }
};

export const updateLaboratory = async (id: number, updatedLaboratory: Laboratory): Promise<Laboratory> => {
  try {
    const response = await apiClient.put<Laboratory>(`/Laboratory/${id}`, updatedLaboratory);
    return response.data;
  } catch (error) {
    console.error('Error updating laboratory:', error);
    throw error;
  }
};

export const deleteLaboratory = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Laboratory/${id}`);
  } catch (error) {
    console.error('Error deleting laboratory:', error);
    throw error;
  }
};

// === Funciones relacionadas con solicitudes de laboratorio ===

export const createLabRequest = async (labRequest: LabRequest): Promise<void> => {
  try {
    await apiClient.post(`/LaboratoryRequest`, labRequest);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error creating lab request:', error.response.data);
    } else {
      console.error('Error creating lab request:', error);
    }
    throw error;
  }
};

export const fetchLabRequests = async (): Promise<LabRequest[]> => handleResponse<LabRequest[]>(`/LaboratoryRequest`);

// Aprobar una solicitud de laboratorio
export const approveLabRequest = async (id: number, message?: string): Promise<void> => {
  if (!id) throw new Error("El ID de la solicitud es requerido.");
  await apiClient.post(`/LaboratoryRequest/${id}/approve`, { message });
};

// Rechazar una solicitud de laboratorio
export const rejectLabRequest = async (id: number, message: string): Promise<void> => {
  if (!id) throw new Error("El ID de la solicitud es requerido.");
  if (!message) throw new Error("Se requiere un mensaje para rechazar la solicitud");
  await apiClient.post(`/LaboratoryRequest/${id}/reject`, { message });
};
