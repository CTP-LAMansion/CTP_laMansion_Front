// src/Services/orderService.ts
import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar las cookies
import { Order, RequestStatus } from '../types/OrderTypes';

const apiUrl = 'https://ctplamansion-production.up.railway.app/api/Order';

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
  const token = getToken(); // Obtener el token desde las cookies
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// GET /api/Order - Obtener todas las órdenes
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get('/');
  return response.data;
};

// POST /api/Order - Crear una nueva orden
export const createOrder = async (order: Omit<Order, 'orderId'>): Promise<Order> => {
  const response = await api.post('/', order);
  return response.data;
};

// GET /api/Order/{id} - Obtener una orden específica por ID
export const getOrderById = async (id: number): Promise<Order> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// DELETE /api/Order/{id} - Eliminar una orden específica
export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

// GET /api/Order/approved-orders - Obtener órdenes aprobadas
export const getApprovedOrders = async (): Promise<Order[]> => {
  const response = await api.get('/approved-orders');
  return response.data;
};

// GET /api/Order/orders-by-status - Obtener órdenes por estado
export const getOrdersByStatus = async (status?: RequestStatus): Promise<Order[]> => {
  const url = status !== undefined
    ? `/orders-by-status?status=${status}`
    : '/orders-by-status';

  const response = await api.get(url);
  return response.data;
};

// PATCH /api/Order/{id}/approve - Aprobar una orden
export const approveOrder = async (id: number, message?: string): Promise<void> => {
  await api.patch(`/${id}/approve`, { message });
};

// PATCH /api/Order/{id}/reject - Rechazar una orden
export const rejectOrder = async (id: number, message: string): Promise<void> => {
  if (!message) throw new Error("Se requiere un mensaje para rechazar la orden");
  await api.patch(`/${id}/reject`, { message });
};

// GET /api/Order/udp/{udpId} - Obtener órdenes asociadas a un UDP específico
export const getOrdersByUdp = async (udpId: number): Promise<Order[]> => {
  const response = await api.get(`/udp/${udpId}`);
  return response.data;
};

// GET /api/Order/user/{userId} - Obtener órdenes realizadas por un usuario específico
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};