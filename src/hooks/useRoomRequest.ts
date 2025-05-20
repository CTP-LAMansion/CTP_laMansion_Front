import { useState } from 'react';
import { createRoomRequest } from '../services/LandingPageServices';
import { RoomRequest } from '../types/RoomRequestType';

export const useRoomRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRoomRequest = async (roomRequest: Omit<RoomRequest, 'id_RoomRequest' | 'status'>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await createRoomRequest(roomRequest);
      setSuccess(true);  // Marcamos como éxito si la solicitud fue enviada
    } catch (error) {
      setError('Error al crear la solicitud de sala.');
      console.error('Error submitting room request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    success,
    submitRoomRequest,
  };
};
