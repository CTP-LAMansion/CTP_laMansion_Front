import axios from 'axios';
import Cookies from 'js-cookie';

// URL base para la API
const BASE_URL = 'https://ctplamansion-production.up.railway.app/api';

// Crear una instancia de Axios con el token de autorización incluido
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a cada solicitud
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaz para la transacción de balance
export interface UDPBalanceTransaction {
  id_UDPBalanceHistory: number;
  transactionDate: string;
  amount: number;
  balanceAfterTransaction: number;
  description: string;
  transactionType: string;
  udpId: number;
}

// Interfaz para la respuesta paginada
export interface PaginatedResponse<T> {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
  hasPrevious: boolean;
  hasNext: boolean;
}

// Interfaz para datos de gráficas mensuales
export interface MonthlyChartData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

// Interfaz para datos de gráficas por tipo
export interface TransactionTypeChartData {
  transactionType: string;
  amount: number;
  percentage: number;
}

// Obtener el historial completo de transacciones para una UDP
export const getUDPBalanceHistory = async (udpId: number): Promise<UDPBalanceTransaction[]> => {
  try {
    const response = await api.get(`/UDPBalanceHistory/${udpId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el historial de balance para la UDP ${udpId}:`, error);
    throw error;
  }
};

// Obtener historial de transacciones por rango de fechas
export const getUDPBalanceHistoryByDateRange = async (
  udpId: number, 
  startDate: string, 
  endDate: string
): Promise<UDPBalanceTransaction[]> => {
  try {
    const response = await api.get(
      `/UDPBalanceHistory/${udpId}/daterange?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el historial de balance por fechas para la UDP ${udpId}:`, error);
    throw error;
  }
};

// Obtener historial de transacciones por tipo
export const getUDPBalanceHistoryByType = async (
  udpId: number, 
  transactionType: string
): Promise<UDPBalanceTransaction[]> => {
  try {
    const response = await api.get(`/UDPBalanceHistory/${udpId}/type/${transactionType}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el historial de balance por tipo para la UDP ${udpId}:`, error);
    throw error;
  }
};

// Obtener datos para gráficas mensuales de ingresos/gastos
export const getUDPBalanceMonthlyChartData = async (
  udpId: number, 
  year?: number
): Promise<MonthlyChartData[]> => {
  try {
    let url = `/UDPBalanceHistory/${udpId}/chart/monthly`;
    if (year) {
      url += `?year=${year}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos para gráfica mensual de la UDP ${udpId}:`, error);
    throw error;
  }
};

// Obtener datos para gráficas de distribución por tipo
export const getUDPBalanceTypeChartData = async (
  udpId: number, 
  isExpense: boolean = true
): Promise<TransactionTypeChartData[]> => {
  try {
    const url = `/UDPBalanceHistory/${udpId}/chart/bytype?isExpense=${isExpense}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos para gráfica por tipo de la UDP ${udpId}:`, error);
    throw error;
  }
};