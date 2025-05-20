import { useState, useEffect } from 'react';
import { getEvents, addEvent, editEvent, deleteEvent } from '../services/LandingPageServices'; // Ajusta la ruta según tu estructura de archivos
import { Event } from '../types/Types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Aún se usa al inicio
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los eventos
  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error fetching events');
    }
  };

  useEffect(() => {
    setLoading(true); // Solo mostramos loading cuando cargamos por primera vez
    fetchEvents().finally(() => setLoading(false));
  }, []);

  // Agregar retraso antes de la recarga sin cambiar el estado loading
  const delayedFetchEvents = async (delay: number = 2000) => {
    setTimeout(async () => {
      await fetchEvents();
    }, delay); // Introduce un retraso de 2 segundos por defecto
  };

  // Función para agregar un evento
  const handleAddEvent = async (newEvent: Event) => {
    try {
      await addEvent(newEvent);
      // Aquí podrías disparar el toast de éxito (ej: toast.success("Evento agregado exitosamente"))
      delayedFetchEvents(); // Recargar eventos con retraso
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Error adding event');
      // Aquí podrías disparar el toast de error (ej: toast.error("Error al agregar evento"))
    }
  };

  // Función para editar un evento
  const handleEditEvent = async (id: number, updatedEvent: Event) => {
    try {
      await editEvent(id, updatedEvent);
      // Aquí podrías disparar el toast de éxito (ej: toast.success("Evento editado exitosamente"))
      delayedFetchEvents(); // Recargar eventos con retraso
    } catch (err) {
      console.error('Error editing event:', err);
      setError('Error editing event');
      // Aquí podrías disparar el toast de error (ej: toast.error("Error al editar evento"))
    }
  };

  // Función para eliminar un evento
  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      // Aquí podrías disparar el toast de éxito (ej: toast.success("Evento eliminado exitosamente"))
      delayedFetchEvents(); // Recargar eventos con retraso
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Error deleting event');
      // Aquí podrías disparar el toast de error (ej: toast.error("Error al eliminar evento"))
    }
  };

  return {
    events,
    loading, // El loading se usará solo para la primera carga
    error,
    handleAddEvent,
    handleEditEvent,
    handleDeleteEvent,
  };
};
