import { useState, useEffect } from 'react';
import { fetchSpecialities, addSpeciality, editSpeciality, deleteSpeciality } from '../services/LandingPageServices'; 
import { Speciality } from '../types/Types';

export const useSpecialities = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener especialidades desde la API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchSpecialities(); // Llamada a la API para obtener especialidades
      setSpecialities(data);
      setError(null);
    } catch (error) {
      setError('Error al obtener las especialidades');
    } finally {
      setLoading(false);
    }
  };

  // Fetch de especialidades cuando el componente carga
  useEffect(() => {
    fetchData();
  }, []);

  // Función para agregar especialidades
  const handleAddSpeciality = async (speciality: Speciality) => {
    try {
      await addSpeciality(speciality); // Llamada a la API para agregar especialidad
      fetchData(); // Volver a obtener los datos para reflejar el cambio
    } catch (error) {
      setError('Error al agregar la especialidad');
    }
  };

  // Función para editar especialidades
  const handleEditSpeciality = async (id: number, updatedSpeciality: Speciality) => {
    try {
      await editSpeciality(id, updatedSpeciality); // Llamada a la API para editar la especialidad
      fetchData(); // Volver a obtener los datos para reflejar el cambio
    } catch (error) {
      setError('Error al editar la especialidad');
    }
  };

  // Función para eliminar especialidades
  const handleDeleteSpeciality = async (id: number) => {
    try {
      await deleteSpeciality(id); // Llamada a la API para eliminar la especialidad
      fetchData(); // Volver a obtener los datos para reflejar el cambio
    } catch (error) {
      setError('Error al eliminar la especialidad');
    }
  };

  return {
    specialities,
    loading,
    error,
    handleAddSpeciality,
    handleEditSpeciality,
    handleDeleteSpeciality,
  };
};
