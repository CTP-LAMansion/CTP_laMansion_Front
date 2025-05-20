import { useState, useEffect } from 'react';
import { OurService } from '../types/Types';
import { fetchOurServices } from '../services/LandingPageServices';

export const useOurServices = () => {
  const [services, setServices] = useState<OurService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchOurServices();
        setServices(data);
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return { services, loading, error };
};