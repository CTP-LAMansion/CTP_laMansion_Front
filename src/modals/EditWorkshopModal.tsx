import React from 'react';

import { Workshop, Speciality } from '../types/Types';
import WorkshopForm from '../DashboardPages/CRUD/Workshops/WorkshopForm';

interface EditWorkshopModalProps {
  show: boolean;
  workshop: Workshop | null;
  specialities: Speciality[];
  onClose: () => void;
  onSave: (workshop: Omit<Workshop, 'id'>) => void;
}

const EditWorkshopModal: React.FC<EditWorkshopModalProps> = ({ show, workshop, specialities, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          {workshop ? 'Editar Taller' : 'Crear Nuevo Taller'}
        </h2>
        {/* Pasamos la función de cierre y guardado al formulario */}
        <WorkshopForm workshop={workshop} specialities={specialities} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditWorkshopModal;
