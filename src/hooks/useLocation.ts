import { useState, useEffect } from 'react';
import { fetchLocation } from '../services/LandingPageServices'; // Ajusta la ruta según sea necesario
import { Location } from '../types/Types'; // Ajusta la ruta según sea necesario

const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const data = await fetchLocation();
        setLocation(data);
      } catch (err) {
        setError('Error al cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
};

export default useLocation;
