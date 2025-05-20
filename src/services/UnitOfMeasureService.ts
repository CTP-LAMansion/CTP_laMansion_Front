import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar las cookies
import { UnitOfMeasure } from '../types/OrderTypes';

const apiUrl = 'https://ctplamansion-production.up.railway.app/api/UnitOfMeasure';

// Helper function para obtener el JWT token desde cookies
const getToken = () => Cookies.get('token');

// Instancia de axios con configuración de URL base y autenticación
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// GET /api/UnitOfMeasure - Obtener todas las unidades de medida
export const getAllUnitOfMeasures = async (): Promise<UnitOfMeasure[]> => {
  const response = await api.get('/');
  return response.data;
};

// POST /api/UnitOfMeasure - Crear una nueva unidad de medida
export const createUnitOfMeasure = async (unitOfMeasure: Omit<UnitOfMeasure, 'unitOfMeasureId'>): Promise<UnitOfMeasure> => {
  const response = await api.post('/', unitOfMeasure);
  return response.data;
};

// GET /api/UnitOfMeasure/{id} - Obtener una unidad de medida específica por ID
export const getUnitOfMeasureById = async (id: number): Promise<UnitOfMeasure> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// PUT /api/UnitOfMeasure/{id} - Actualizar una unidad de medida específica
export const updateUnitOfMeasure = async (id: number, unitOfMeasure: Omit<UnitOfMeasure, 'unitOfMeasureId'>): Promise<UnitOfMeasure> => {
  const response = await api.put(`/${id}`, unitOfMeasure);
  return response.data;
};

// PATCH /api/UnitOfMeasure/{id} - Actualizar parcialmente una unidad de medida
export const patchUnitOfMeasure = async (id: number, partialUnitOfMeasure: Partial<UnitOfMeasure>): Promise<UnitOfMeasure> => {
  const response = await api.patch(`/${id}`, partialUnitOfMeasure);
  return response.data;
};

// DELETE /api/UnitOfMeasure/{id} - Eliminar una unidad de medida específica
export const deleteUnitOfMeasure = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};