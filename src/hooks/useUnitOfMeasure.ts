import { useState, useEffect } from 'react';
import {
  getAllUnitOfMeasures,
  createUnitOfMeasure,
  getUnitOfMeasureById,
  updateUnitOfMeasure,
  patchUnitOfMeasure,
  deleteUnitOfMeasure
} from '../services/UnitOfMeasureService';
import { UnitOfMeasure } from '../types/OrderTypes';

// Type for the simplified form data
type UnitOfMeasureFormData = {
  name: string;
};

const useUnitOfMeasure = () => {
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState<UnitOfMeasure | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all unit of measures
  const fetchUnitOfMeasures = async () => {
    setLoading(true);
    try {
      const data = await getAllUnitOfMeasures();
      setUnitOfMeasures(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching unit of measures:', err);
      setError('Error al obtener las unidades de medida');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific unit of measure by ID
  const fetchUnitOfMeasureById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getUnitOfMeasureById(id);
      setSelectedUnitOfMeasure(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching unit of measure:', err);
      setError('Error al obtener la unidad de medida');
    } finally {
      setLoading(false);
    }
  };

  // Add a new unit of measure
  const handleAddUnitOfMeasure = async (unitOfMeasureData: UnitOfMeasureFormData) => {
    try {
      const newUnitOfMeasure = {
        unitOfMeasureId: 0,
        name: unitOfMeasureData.name
      };
      await createUnitOfMeasure(newUnitOfMeasure);
      fetchUnitOfMeasures();
    } catch (err) {
      console.error('Error adding unit of measure:', err);
      setError('Error al agregar la unidad de medida');
      throw err; // Rethrow to let the form handle the error
    }
  };

  // Update an existing unit of measure
  const handleUpdateUnitOfMeasure = async (id: number, unitOfMeasureData: UnitOfMeasureFormData) => {
    try {
      const updatedUnitOfMeasure = {
        unitOfMeasureId: id,
        name: unitOfMeasureData.name
      };
      await updateUnitOfMeasure(id, updatedUnitOfMeasure);
      fetchUnitOfMeasures();
    } catch (err) {
      console.error('Error updating unit of measure:', err);
      setError('Error al actualizar la unidad de medida');
      throw err; // Rethrow to let the form handle the error
    }
  };

  // Partially update a unit of measure
  const handlePatchUnitOfMeasure = async (id: number, partialUnitOfMeasure: Partial<UnitOfMeasure>) => {
    try {
      await patchUnitOfMeasure(id, partialUnitOfMeasure);
      fetchUnitOfMeasures();
    } catch (err) {
      console.error('Error patching unit of measure:', err);
      setError('Error al actualizar parcialmente la unidad de medida');
      throw err;
    }
  };

  // Delete a unit of measure
  const handleDeleteUnitOfMeasure = async (id: number) => {
    try {
      await deleteUnitOfMeasure(id);
      fetchUnitOfMeasures();
    } catch (err) {
      console.error('Error deleting unit of measure:', err);
      setError('Error al eliminar la unidad de medida');
      throw err;
    }
  };

  // Load unit of measures on component mount
  useEffect(() => {
    fetchUnitOfMeasures();
  }, []);

  return {
    unitOfMeasures,
    selectedUnitOfMeasure,
    loading,
    error,
    fetchUnitOfMeasures,
    fetchUnitOfMeasureById,
    handleAddUnitOfMeasure,
    handleUpdateUnitOfMeasure,
    handlePatchUnitOfMeasure,
    handleDeleteUnitOfMeasure
  };
};

export default useUnitOfMeasure;