import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Gallery, Category } from '../../../types/Types';
import ImageUploader from '../../../components/ImageUploader';
import useCategories from '../../../hooks/useCategories';

interface GalleryFormProps {
  gallery: Gallery | null;
  onSave: (gallery: Gallery) => void;
  onCancel: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ gallery, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<Gallery>({
    defaultValues: gallery || {
      id_Gallery: 0,
      title: '',
      url_Image: '',
      categoryId: 0,
      category: undefined
    },
  });
  
  const { categories, loading } = useCategories();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtrar categorías según el término de búsqueda
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la selección de categoría
  const handleCategorySelect = (category: Category) => {
    setValue('categoryId', category.id_Category);
    setSearchTerm(category.name);
    setShowDropdown(false);
  };

  // Manejar la carga de imagen
  const handleImageUpload = (url: string) => {
    setValue('url_Image', url);
  };

  // Enviar el formulario
  const onSubmit = (data: Gallery) => {
    onSave(data);
    reset();
  };
  
  // Manejar cancelación con confirmación
  const handleCancel = () => {
    setShowConfirmation(true);
  };
  
  const confirmCancel = () => {
    reset();
    onCancel();
    setShowConfirmation(false);
  };
  
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Establecer el término de búsqueda inicial si estamos editando
  useEffect(() => {
    if (gallery && gallery.category) {
      setSearchTerm(gallery.category.name);
    }
  }, [gallery]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-800">
      {/* Campo de título */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Título de la imagen</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "El título es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                type="text"
                className={`border ${error ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                placeholder="Ingrese un título descriptivo para la imagen"
                required
              />
              {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
            </>
          )}
        />
      </div>

      {/* Componente para subir imagen */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Imagen</label>
        <ImageUploader onImageUpload={handleImageUpload} />
        <Controller
          name="url_Image"
          control={control}
          rules={{ required: "La imagen es obligatoria" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input {...field} type="hidden" />
              {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              {field.value && (
                <div className="mt-2">
                  <img 
                    src={field.value} 
                    alt="Vista previa" 
                    className="max-h-40 rounded-md object-cover"
                  />
                </div>
              )}
            </>
          )}
        />
      </div>

      {/* Campo de selección de categoría con búsqueda */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Categoría</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="border border-gray-300 p-2 rounded-md w-full"
            placeholder="Buscar categoría..."
            required
          />
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Debe seleccionar una categoría" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <input {...field} type="hidden" />
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </>
            )}
          />

          {/* Dropdown de categorías */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="p-2 text-center">Cargando categorías...</div>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id_Category}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  No se encontraron categorías
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción - Invertido el orden: Guardar a la izquierda, Cancelar a la derecha */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Guardar
        </button>
            
            <button
            type="button"
            onClick={handleCancel} // Usa handleCancel en lugar de onCancel directamente
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
            Cancelar
            </button>

      </div>
      
      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro?</h3>
            <p className="mb-6">Los cambios que has realizado no se guardarán.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelConfirmation}
              >
                Seguir editando
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmCancel}
              >
                Descartar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default GalleryForm;