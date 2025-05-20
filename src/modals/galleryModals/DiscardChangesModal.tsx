import React from 'react';

interface DiscardChangesModalProps {
  isOpen: boolean;
  onContinueEditing: () => void;
  onDiscard: () => void;
}

const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  isOpen,
  onContinueEditing,
  onDiscard
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Descartar cambios?</h2>
        <p className="mb-6 text-gray-600">
          Los cambios realizados no se guardarán. ¿Estás seguro de que deseas cerrar?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onContinueEditing}
          >
            Continuar editando
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onDiscard}
          >
            Descartar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardChangesModal;