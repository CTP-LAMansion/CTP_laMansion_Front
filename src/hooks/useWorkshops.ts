import { useState, useEffect } from 'react';
import { Workshop, Speciality } from '../types/Types';
import {
  getAllWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  fetchSpecialities,
} from '../services/LandingPageServices';

export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]); // Estado para especialidades
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los workshops
  const fetchWorkshops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllWorkshops(); // Obtener todos los workshops
      setWorkshops(data); // Actualizar la lista de workshops
    } catch (err) {
      setError('Error al cargar los talleres');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar todas las especialidades
  const fetchSpecialitiesList = async () => {
    try {
      const data = await fetchSpecialities();
      setSpecialities(data); // Guardar las especialidades en el estado
    } catch (err) {
      setError('Error al cargar las especialidades');
    }
  };

  // Función para agregar un nuevo workshop
  const handleAddWorkshop = async (workshopData: Omit<Workshop, 'id'>) => {
    try {
      await createWorkshop(workshopData); // Crear el workshop
      fetchWorkshops(); // Volver a obtener los workshops para reflejar los cambios
    } catch (err) {
      setError('Error al agregar el taller');
    }
  };

  // Función para editar un workshop existente
  const handleEditWorkshop = async (id: number, updatedWorkshop: Omit<Workshop, 'id'>) => {
    try {
      await updateWorkshop(id, updatedWorkshop); // Actualizar el workshop
      fetchWorkshops(); // Volver a obtener los workshops para reflejar los cambios
    } catch (err) {
      setError('Error al actualizar el taller');
    }
  };

  // Función para eliminar un workshop
  const handleDeleteWorkshop = async (id: number) => {
    try {
      await deleteWorkshop(id); // Eliminar el workshop
      fetchWorkshops(); // Volver a obtener los workshops para reflejar los cambios
    } catch (err) {
      setError('Error al eliminar el taller');
    }
  };

  // Cargar workshops y especialidades al montar el componente
  useEffect(() => {
    fetchWorkshops(); // Cargar los workshops al inicio
    fetchSpecialitiesList(); // Cargar las especialidades al inicio
  }, []);

  return {
    workshops,
    specialities, // También devolvemos las especialidades
    loading,
    error,
    handleAddWorkshop,
    handleEditWorkshop,
    handleDeleteWorkshop,
  };
};
