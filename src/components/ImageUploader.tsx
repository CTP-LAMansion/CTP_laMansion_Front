import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ImageUploaderProps = {
  onImageUpload: (url: string) => void;
  initialImage?: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, initialImage }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=bf79f82c0d0d19e2d9c15e6247dca5f7`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const imageUrl = response.data.data.url;
      onImageUpload(imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto image-uploader flex flex-col items-center gap-3 p-4 bg-white shadow rounded-lg">
      <label className="text-center font-semibold text-base sm:text-lg text-gray-800">
        Subir Imagen
      </label>

      {preview && (
        <img
          src={preview}
          alt="Vista previa"
          className="w-full max-w-[120px] aspect-square object-cover rounded-lg shadow"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full text-sm border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        disabled={loading}
      />

      {loading && <p className="text-blue-500 text-sm">Subiendo imagen...</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
};

export default ImageUploader;
