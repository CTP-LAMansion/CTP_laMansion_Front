import { useState, useEffect } from 'react';
import { 
  getOrdersByStatus, 
  approveOrder, 
  rejectOrder, 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  deleteOrder, 
  getApprovedOrders,
  getOrdersByUdp,
  getOrdersByUser
} from '../services/orderService';
import { Order, RequestStatus } from '../types/OrderTypes';

export const useOrders = (
  initialStatus: RequestStatus | 'All' = RequestStatus.Pending,
  loadInitialData: boolean = true // Nuevo parámetro para controlar carga inicial
) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(loadInitialData);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders based on the given status
  const fetchOrdersData = async (status: RequestStatus | 'All') => {
    setLoading(true);
    try {
      let data: Order[] = [];

      if (status === 'All') {
        const approvedOrders = await getOrdersByStatus(RequestStatus.Approved);
        const rejectedOrders = await getOrdersByStatus(RequestStatus.Rejected);
        data = [...approvedOrders, ...rejectedOrders]; // Combine both arrays
      } else {
        data = await getOrdersByStatus(status);
      }

      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setError('Error al obtener las órdenes');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all orders regardless of status
  const handleGetAllOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener todas las órdenes:', err);
      setError('Error al obtener todas las órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Get all approved orders
  const handleGetApprovedOrders = async () => {
    setLoading(true);
    try {
      const data = await getApprovedOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes aprobadas:', err);
      setError('Error al obtener órdenes aprobadas');
    } finally {
      setLoading(false);
    }
  };

  // Get orders by UDP
  const handleGetOrdersByUdp = async (udpId: number) => {
    setLoading(true);
    try {
      const data = await getOrdersByUdp(udpId);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes por UDP:', err);
      setError('Error al obtener órdenes por UDP');
    } finally {
      setLoading(false);
    }
  };

  // Get orders by user ID
  const handleGetOrdersByUser = async (userId: string) => {
    setLoading(true);
    try {
      const data = await getOrdersByUser(userId);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes del usuario:', err);
      setError('Error al obtener órdenes del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Get a specific order by ID
  const handleGetOrderById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      setSelectedOrder(data);
      setError(null);
      return data; // Add this return statement
    } catch (err) {
      console.error('Error al obtener la orden:', err);
      setError('Error al obtener la orden');
      setSelectedOrder(null);
      return null; // Add this return statement
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (id: number) => {
    setLoading(true);
    try {
      await deleteOrder(id);
      // After deletion, refresh the orders list
      fetchOrdersData(initialStatus);
      setError(null);
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
      setError('Error al eliminar la orden');
    } finally {
      setLoading(false);
    }
  };
  
  // Solo cargar datos iniciales si loadInitialData es true
  useEffect(() => {
    if (loadInitialData) {
      fetchOrdersData(initialStatus);
    } else {
      // Si no cargamos datos, asegúrate de que loading esté en false
      setLoading(false);
    }
  }, [initialStatus, loadInitialData]);
  const handleApproveOrder = async (id: number, message?: string) => {
    try {
      await approveOrder(id, message);
      if (loadInitialData) {
        fetchOrdersData(initialStatus);  // Refresh orders after approval only if we're loading data
      }
    } catch (err) {
      console.error('Error al aprobar la orden:', err);
      setError('Error al aprobar la orden');
    }
  };

  const handleRejectOrder = async (id: number, message: string) => {
    try {
      if (!message || message.trim() === '') {
        throw new Error('Es necesario proporcionar un motivo para rechazar la orden');
      }
      await rejectOrder(id, message);
      if (loadInitialData) {
        fetchOrdersData(initialStatus);  // Refresh orders after rejection only if we're loading data
      }
    } catch (err: any) {
      console.error('Error al rechazar la orden:', err);
      setError(err instanceof Error ? err.message : 'Error al rechazar la orden');
    }
  };

  const handleCreateOrder = async (order: Order) => {
    setLoading(true);
    try {
      const newOrder = await createOrder(order);
      if (loadInitialData) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);  // Añadir la nueva orden a la lista
      }
      setError(null);
      return newOrder; // Retornar la orden creada
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError('Error al crear la orden');
      throw err; // Propagar el error para manejo en el componente
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,                       // Lista de órdenes
    selectedOrder,                // Orden seleccionada (para getOrderById)
    loading,                      // Estado de carga
    error,                        // Mensaje de error si ocurre uno
    handleApproveOrder,           // Función para aprobar una orden
    handleRejectOrder,            // Función para rechazar una orden
    fetchOrdersData,              // Función para obtener órdenes con un estado específico
    handleCreateOrder,            // Función para crear una nueva orden
    handleGetAllOrders,           // Función para obtener todas las órdenes
    handleGetOrderById,           // Función para obtener una orden específica por ID
    handleDeleteOrder,            // Función para eliminar una orden
    handleGetApprovedOrders,      // Función para obtener órdenes aprobadas
    handleGetOrdersByUdp,         // Función para obtener órdenes por UDP
    handleGetOrdersByUser,        // Función para obtener órdenes por usuario
  };
};