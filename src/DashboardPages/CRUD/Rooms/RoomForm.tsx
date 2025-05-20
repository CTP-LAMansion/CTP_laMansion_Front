import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Room } from '../../../types/Types';
import ImageUploader from '../../../components/ImageUploader'; // Asegúrate de importar correctamente el componente

interface RoomFormProps {
  room: Room | null;
  onSave: (room: Room) => Promise<void>;
  onCancel: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<Room>({
    defaultValues: room || {
      id_Room: 0,
      name: '',
      capacity: 0,
      description: '',
      url_Image: '',
      isConferenceRoom: false,
      isActive: true, // Valor por defecto para isActive
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (url: string) => {
    setValue('url_Image', url); // Actualiza el valor de la URL en el formulario
  };

  const onSubmit = async (data: Room) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      reset();
    } catch (error) {
      console.error('Error al guardar la sala:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-800">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Nombre de la sala</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el nombre de la sala"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Capacidad</label>
        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese la capacidad"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Descripción</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese una descripción"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <ImageUploader onImageUpload={handleImageUpload} />
        <Controller
          name="url_Image"
          control={control}
          render={({ field }) => (
            <input {...field} type="hidden" /> // Campo oculto para almacenar la URL de la imagen
          )}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label htmlFor="isConferenceRoom" className="font-semibold">
          ¿Es Sala de Conferencias?
        </label>
        <Controller
          name="isConferenceRoom"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-5 w-5"
            />
          )}
        />
      </div>

      {/* Nuevo campo para activar/desactivar la sala */}
      <div className="flex items-center space-x-4">
        <label htmlFor="isActive" className="font-semibold">
          Sala Activa
        </label>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-5 w-5"
            />
          )}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-4">
      
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default RoomForm;