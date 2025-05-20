import React from 'react';
import EventForm from '../DashboardPages/CRUD/Eventos/EventForm';
import { Event } from '../types/Types';

interface EditEventModalProps {
  show: boolean;
  event: Event | null;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const formatDateForInput = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toISOString().slice(0, 16); // Formato 'YYYY-MM-DDTHH:mm'
};

const EditEventModal: React.FC<EditEventModalProps> = ({ show, event, onClose, onSave }) => {
  if (!show) return null;

  const eventWithFormattedDate = event
    ? { ...event, date: new Date(formatDateForInput(event.date)) } // Convertimos de vuelta a Date
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-3/4 max-w-lg p-6 relative shadow-lg">
        <h2 className="text-2xl text-gray-800 font-semibold mb-6">
          {event ? 'Editar Evento' : 'Agregar Evento'}
        </h2>
        
        {/* Formulario de evento con los datos correspondientes */}
        <EventForm event={eventWithFormattedDate} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditEventModal;
