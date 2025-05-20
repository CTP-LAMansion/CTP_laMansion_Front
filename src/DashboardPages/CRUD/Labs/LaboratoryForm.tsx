import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Laboratory } from '../../../types/LaboratoryRequestType';
import ImageUploader from '../../../components/ImageUploader'; // Asegúrate de importar correctamente el componente

interface LaboratoryFormProps {
  laboratory: Laboratory | null;
  onSave: (laboratory: Laboratory) => void;
  onCancel: () => void;
}

const LaboratoryForm: React.FC<LaboratoryFormProps> = ({ laboratory, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<Laboratory>({
    defaultValues: laboratory || { id_Laboratory: 0, name: '', description: '', capacity: 0, url_Image: '', isActive: false },
  });

  const onSubmit = (data: Laboratory) => {
    onSave(data);
    reset();
  };

  const handleImageUpload = (url: string) => {
    setValue('url_Image', url); // Actualiza la URL de la imagen en el formulario
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-800">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Nombre</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el nombre"
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
            <textarea
              {...field}
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese la descripción"
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
        {/* Componente ImageUploader */}
        <ImageUploader onImageUpload={handleImageUpload} />
        {/* Campo oculto para almacenar la URL de la imagen */}
        <Controller
          name="url_Image"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="hidden"
              required
            />
          )}
        />
      </div>

      <div className="flex items-center">
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
        <label className="font-semibold">Laboratorio Activo</label>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Guardar
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

export default LaboratoryForm;
