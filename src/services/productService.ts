import axios from 'axios';
import Cookies from 'js-cookie';
import { Product } from '../types/OrderTypes';

const apiUrl = 'https://ctplamansion-production.up.railway.app/api/Product';

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

// GET /api/Product - Obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get('/');
  return response.data;
};

// POST /api/Product - Crear un nuevo producto
export const createProduct = async (product: Omit<Product, 'id_Product'>): Promise<Product> => {
  const response = await api.post('/', product);
  return response.data;
};

// GET /api/Product/{id} - Obtener un producto específico por ID
export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// PUT /api/Product/{id} - Actualizar un producto específico
export const updateProduct = async (id: number, product: Omit<Product, 'id_Product'>): Promise<Product> => {
  const response = await api.put(`/${id}`, product);
  return response.data;
};

// PATCH /api/Product/{id} - Actualizar parcialmente un producto
export const patchProduct = async (id: number, partialProduct: Partial<Product>): Promise<Product> => {
  const response = await api.patch(`/${id}`, partialProduct);
  return response.data;
};

// DELETE /api/Product/{id} - Eliminar un producto específico
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

// GET /api/Product/search - Buscar productos por nombre
export const searchProductsByName = async (name: string): Promise<Product[]> => {
  const response = await api.get('/search', { params: { term: name } });
  return response.data;
};

// GET /api/Product/by-name - Obtener producto por nombre exacto
export const getProductByExactName = async (name: string): Promise<Product> => {
  const response = await api.get('/by-name', { params: { name } });
  return response.data;
};