import { useState, useEffect } from 'react';
import { fetchRooms, addRoom, editRoom, deleteRoom, fetchRoomRequests, approveRoomRequest, rejectRoomRequest } from '../services/RoomServices'; // Importamos los servicios de API
import { Room } from '../types/Types'; // Importamos el tipo 'Room'
import { RoomRequest } from '../types/RoomRequestType'; // Importamos RoomRequest para gestionar las solicitudes de sala

export const useRoomsAndRequests = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomRequests, setRoomRequests] = useState<RoomRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las salas
  const fetchRoomsData = async () => {
    try {
      const data = await fetchRooms(); // Llamada al servicio API para obtener las salas
      setRooms(data);
    } catch (error) {
      console.error('Error al obtener las salas:', error);
      setError('Error al obtener las salas');
    }
  };

  // Obtener todas las solicitudes de sala
  const fetchRoomRequestsData = async () => {
    try {
      const data = await fetchRoomRequests(); // Llamada al servicio API para obtener las solicitudes
      setRoomRequests(data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      setError('Error al obtener las solicitudes');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRoomsData(), fetchRoomRequestsData()]) // Obtener ambas listas al cargar
      .finally(() => setLoading(false));
  }, []);

  // Recargar datos después de agregar, editar o eliminar
  const delayedFetchData = async (delay: number = 2000) => {
    setTimeout(async () => {
      await Promise.all([fetchRoomsData(), fetchRoomRequestsData()]);
    }, delay); // Introducimos un retraso por defecto de 2 segundos
  };

  // Función para agregar una sala
  const handleAddRoom = async (newRoom: Room) => {
    try {
      await addRoom(newRoom);
      delayedFetchData(); // Recargar los datos tras agregar
    } catch (error) {
      console.error('Error al agregar la sala:', error);
      setError('Error al agregar la sala');
    }
  };

  // Función para editar una sala
  const handleEditRoom = async (id: number, updatedRoom: Room) => {
    try {
      await editRoom(id, updatedRoom);
      delayedFetchData(); // Recargar los datos tras editar
    } catch (error) {
      console.error('Error al editar la sala:', error);
      setError('Error al editar la sala');
    }
  };

  // Función para eliminar una sala
  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id);
      delayedFetchData(); // Recargar los datos tras eliminar
    } catch (error) {
      console.error('Error al eliminar la sala:', error);
      setError('Error al eliminar la sala');
    }
  };
  // Aprobar una solicitud de sala con mensaje opcional
  const handleApproveRequest = async (id: number, message?: string) => {
    try {
      await approveRoomRequest(id, message);
      delayedFetchData(); // Recargar los datos tras aprobar
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
      setError('Error al aprobar la solicitud');
    }
  };

  // Rechazar una solicitud de sala con mensaje obligatorio
  const handleRejectRequest = async (id: number, message: string) => {
    try {
      if (!message || message.trim() === '') {
        throw new Error('Es necesario proporcionar un motivo para rechazar la solicitud');
      }
      await rejectRoomRequest(id, message);
      delayedFetchData(); // Recargar los datos tras rechazar
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      setError(error instanceof Error ? error.message : 'Error al rechazar la solicitud');
    }
  };

  return {
    rooms,
    roomRequests,
    loading,
    error,
    handleAddRoom,
    handleEditRoom,
    handleDeleteRoom,
    handleApproveRequest,
    handleRejectRequest,
    fetchRoomRequestsData, // Exponemos la función para recargar solicitudes de sala
  };
};
