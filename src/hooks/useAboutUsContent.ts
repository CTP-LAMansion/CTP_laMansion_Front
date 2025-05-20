import { useState, useEffect } from 'react';
import { getAboutUsContent } from '../services/LandingPageServices'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { AboutUsContent } from '../types/Types';

export const useAboutUsContent = () => {
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutUsContent();
        setContent(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return { content, loading, error };
};
