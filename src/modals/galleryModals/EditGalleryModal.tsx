import React from 'react';
import { Gallery } from '../../types/Types';
import GalleryForm from '../../DashboardPages/CRUD/GalleryCategory/GalleryForm';

interface EditGalleryModalProps {
  isOpen: boolean;
  gallery: Gallery | null;
  onSave: (gallery: Gallery) => Promise<void>;
  onClose: () => void;
}

const EditGalleryModal: React.FC<EditGalleryModalProps> = ({ 
  isOpen, 
  gallery, 
  onSave, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {gallery ? 'Editar Imagen' : 'Añadir Nueva Imagen'}
        </h2>
        <GalleryForm
          gallery={gallery}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default EditGalleryModal;