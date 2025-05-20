import React from 'react';
import LaboratoryForm from '../DashboardPages/CRUD/Labs/LaboratoryForm';
import { Laboratory } from '../types/LaboratoryRequestType';

interface EditLaboratoryModalProps {
  show: boolean;
  laboratory: Laboratory | null;
  onClose: () => void;
  onSave: (laboratory: Laboratory) => void;
}

const EditLaboratoryModal: React.FC<EditLaboratoryModalProps> = ({ show, laboratory, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          {laboratory ? 'Editar Laboratorio' : 'Agregar Laboratorio'}
        </h2>
        <LaboratoryForm laboratory={laboratory} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditLaboratoryModal;