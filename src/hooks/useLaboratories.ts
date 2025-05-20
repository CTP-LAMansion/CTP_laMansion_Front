import { useState, useEffect } from 'react';

import { addLaboratory, deleteLaboratory, fetchLaboratories as fetchLabService, updateLaboratory } from '../services/LaboratoryService';

import { Laboratory } from '../types/Types';

export const useLaboratories = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchLaboratoriesData = async () => {

    setLoading(true);
    try {
      const data = await fetchLabService();
      setLaboratories(data);
      setError(null); // Restablecer el error en caso de éxito
    } catch (err) {

      console.error('Error fetching laboratories:', err);
      setError('Error fetching laboratories');

    } finally {
      setLoading(false);
    }
  };

  // Cargar laboratorios al montar el componente
  useEffect(() => {

    fetchLaboratoriesData();
  }, []);

  const handleAddLaboratory = async (newLaboratory: Laboratory) => {
    try {
      await addLaboratory(newLaboratory);
      fetchLaboratoriesData();

    } catch (err) {
      Error('Error adding laboratory');
    }
  };

  const handleEditLaboratory = async (id: number, updatedLaboratory: Laboratory) => {
    try {
      await updateLaboratory(id, updatedLaboratory);

      fetchLaboratoriesData();

    } catch (err) {
      Error('Error editing laboratory');
    }
  };

  const handleDeleteLaboratory = async (id: number) => {
    try {
      await deleteLaboratory(id);

      fetchLaboratoriesData();

    } catch (err) {
      Error('Error deleting laboratory');
    }
  };

  return {
    laboratories,
    loading,
    error,
    handleAddLaboratory,
    handleEditLaboratory,
    handleDeleteLaboratory,
  };
};
