import { useEffect, useState } from 'react';
import { fetchUserLabRequests, fetchUserRoomRequests, fetchUserOrders } from '../services/UserRequestService';
import { LabRequest } from '../types/LaboratoryRequestType';
import { RoomRequest } from '../types/RoomRequestType';
import { Order } from '../types/OrderTypes';

export const useUserRequests = (userId: number) => {
    const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
    const [roomRequests, setRoomRequests] = useState<RoomRequest[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const [lab, room, ord] = await Promise.all([
            fetchUserLabRequests(userId.toString()),
            fetchUserRoomRequests(userId.toString()),
            fetchUserOrders(userId.toString()),
          ]);
          setLabRequests(lab);
          setRoomRequests(room);
          setOrders(ord);
        } catch (err) {
          setError('Error al cargar las solicitudes. Verifique la conexión.');
        } finally {
          setLoading(false);
        }
      };
  
      if (userId) fetchRequests();
    }, [userId]);
  
    return { labRequests, roomRequests, orders, loading, error };
  };
