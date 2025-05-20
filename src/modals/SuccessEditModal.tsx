import React, { useEffect } from 'react';

interface SuccessEditModalProps {
  show: boolean;
  onClose: () => void;
}

const SuccessEditModal: React.FC<SuccessEditModalProps> = ({ show, onClose }) => {
  // Cerrar automáticamente el modal después de 3 segundos
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <div className="bg-white p-6 rounded shadow-lg w-1/2 transform transition-all ease-out duration-300 scale-100">
        <h2 id="success-modal-title" className="text-xl font-bold mb-4">Éxito</h2>
        <p id="success-modal-description" className="text-sm text-gray-500 mb-4">
          Los datos se han editado correctamente.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            aria-label="Cerrar"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessEditModal;
