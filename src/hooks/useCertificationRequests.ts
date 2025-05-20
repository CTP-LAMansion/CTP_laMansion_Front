import { useState, useEffect } from 'react';
import { getRequests, getCertificationNames, rejectRequest, approveRequest, setDeliveryDeadline } from '../services/LandingPageServices';
import { CertificationRequest } from '../types/Types';

const useCertificationRequests = () => {
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [certificationNames, setCertificationNames] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todas las solicitudes y nombres de certificaciones
  const fetchRequestsAndNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const [requestsData, certificationNamesData] = await Promise.all([
        getRequests(),
        getCertificationNames(),
      ]);
      setRequests(requestsData);
      setCertificationNames(certificationNamesData);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsAndNames();
  }, []);
  // Función para rechazar una solicitud
  const handleRejectRequest = async (id: number, message: string) => {
    try {
      if (!message || message.trim() === '') {
        throw new Error('Es necesario proporcionar un motivo para rechazar la solicitud');
      }
      await rejectRequest(id, message);
      fetchRequestsAndNames(); // Refrescar solicitudes después de la acción
    } catch (err: any) {
      setError(err.message || 'Error al rechazar la solicitud');
    }
  };

  // Función para aprobar una solicitud
  const handleApproveRequest = async (id: number, message?: string) => {
    try {
      await approveRequest(id, message);
      fetchRequestsAndNames(); // Refrescar solicitudes después de la acción
    } catch (err: any) {
      setError(err.message || 'Error al aprobar la solicitud');
    }
  };

  // Función para establecer los días de entrega
  const handleSetDeliveryDeadline = async (id: number, deliveryDays: number) => {
    try {
      await setDeliveryDeadline(id, deliveryDays);
      fetchRequestsAndNames(); // Refrescar solicitudes después de la acción
    } catch (err: any) {
      setError(err.message || 'Error al establecer la fecha límite');
    }
  };

  // Obtener el nombre de la certificación por id
  const getCertificationName = (certificationNameId: number) => {
    const certification = certificationNames.find((cert) => cert.id === certificationNameId);
    return certification ? certification.name : 'Nombre no encontrado';
  };

  return {
    requests,
    certificationNames,
    loading,
    error,
    handleRejectRequest,
    handleApproveRequest,
    setDeliveryDeadline: handleSetDeliveryDeadline,
    getCertificationName, // Exponer función para obtener el nombre de la certificación
  };
};

export default useCertificationRequests;
