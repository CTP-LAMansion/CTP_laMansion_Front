import React from 'react';
import RoomForm from '../DashboardPages/CRUD/Rooms/RoomForm';
import { Room } from '../types/Types';

interface EditRoomModalProps {
  show: boolean;
  room: Room | null;
  onClose: () => void;
  onSave: (room: Room) => Promise<void>;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ show, room, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          {room ? 'Editar Sala' : 'Agregar Sala'}
        </h2>
        <RoomForm room={room} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EditRoomModal;
