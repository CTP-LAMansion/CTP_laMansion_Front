import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemType: 'gallery' | 'category';
  showDeleteOptions?: boolean;
  deleteAssociatedImages: boolean;
  setDeleteAssociatedImages: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  itemType,
  showDeleteOptions = false,
  deleteAssociatedImages,
  setDeleteAssociatedImages,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmar eliminación</h2>
        <p className="mb-4 text-gray-600">
          {`¿Estás seguro que deseas eliminar ${itemType === 'gallery' ? 'esta imagen' : 'esta categoría'}? Esta acción no se puede deshacer.`}
        </p>
        
        {/* Opción para eliminar imágenes asociadas a una categoría */}
        {showDeleteOptions && (
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={deleteAssociatedImages}
                onChange={(e) => setDeleteAssociatedImages(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Eliminar también todas las imágenes asociadas a esta categoría</span>
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;