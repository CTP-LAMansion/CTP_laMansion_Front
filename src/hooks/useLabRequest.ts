import { useState } from 'react';
import { LabRequest } from '../types/LaboratoryRequestType';
import { createLabRequest } from '../services/LaboratoryService';


export const useLabRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLabRequest = async (labRequest: Omit<LabRequest, 'id_LabRequest' | 'status'>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await createLabRequest(labRequest);  // Llamada al servicio para crear la solicitud de laboratorio
      setSuccess(true);  // Marcamos como éxito si la solicitud fue enviada correctamente
    } catch (error) {
      setError('Error al crear la solicitud de laboratorio.');
      console.error('Error submitting lab request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    success,
    submitLabRequest,
  };
};
