import React, { ReactNode } from 'react';

interface EditSpecialityModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

const EditSpecialityModal: React.FC<EditSpecialityModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-3/4 max-w-lg p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default EditSpecialityModal;
