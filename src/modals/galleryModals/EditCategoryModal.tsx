import React from 'react';
import { Category } from '../../types/Types';
import CategoryForm from '../../DashboardPages/CRUD/GalleryCategory/CategoryForm';

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onSave: (category: Category) => Promise<void>;
  onClose: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  category,
  onSave,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {category ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
        </h2>
        <CategoryForm
          category={category}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default EditCategoryModal;