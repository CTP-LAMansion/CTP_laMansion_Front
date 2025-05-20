import { useState, useEffect } from 'react';
import { fetchLaboratories, fetchLabRequests, approveLabRequest, rejectLabRequest } from '../services/LaboratoryService';
import { Laboratory } from '../types/Types';
import { LabRequest } from '../types/LaboratoryRequestType';

export const useLabsAndRequests = () => {
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [loadingLabs, setLoadingLabs] = useState<boolean>(true);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar laboratorios
  const fetchLabsData = async () => {
    setLoadingLabs(true);
    try {
      const data = await fetchLaboratories();
      setLabs(data);
      setError(null); // Resetea el error si los datos se cargan correctamente
    } catch (error) {
      console.error('Error al obtener los laboratorios:', error);
      setError('Error al obtener los laboratorios');
    } finally {
      setLoadingLabs(false);
    }
  };

  // Función para cargar solicitudes de laboratorio
  const fetchLabRequestsData = async () => {
    setLoadingRequests(true);
    try {
      const data = await fetchLabRequests();
      setLabRequests(data);
      setError(null); // Resetea el error si los datos se cargan correctamente
    } catch (error) {
      console.error('Error al obtener las solicitudes de laboratorio:', error);
      setError('Error al obtener las solicitudes de laboratorio');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    fetchLabsData();
    fetchLabRequestsData();
  }, []);

  // Función de recarga con retraso opcional
  // Aprobar solicitud de laboratorio
  const handleApproveLabRequest = async (id: number, message?: string) => {
    try {
      await approveLabRequest(id, message);
      fetchLabRequestsData(); // Recarga inmediatamente después de aprobar
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
      setError('Error al aprobar la solicitud');
    }
  };

  // Rechazar solicitud de laboratorio
  const handleRejectLabRequest = async (id: number, message: string) => {
    try {
      if (!message || message.trim() === '') {
        throw new Error('Es necesario proporcionar un motivo para rechazar la solicitud');
      }
      await rejectLabRequest(id, message);
      fetchLabRequestsData(); // Recarga inmediatamente después de rechazar
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      setError(error instanceof Error ? error.message : 'Error al rechazar la solicitud');
    }
  };

  return {
    labs,
    labRequests,
    loading: loadingLabs || loadingRequests, // Combinación de estados de carga
    error,
    handleApproveLabRequest,
    handleRejectLabRequest,
    fetchLabRequestsData,
  };
};
