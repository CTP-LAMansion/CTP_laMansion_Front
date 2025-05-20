import { useState, useEffect } from 'react';
import { fetchMission, fetchVision } from '../services/LandingPageServices'; // Asegúrate de que la ruta es correcta
import { Mission, Vision, Value } from '../types/Types'; // Asegúrate de que los tipos están definidos
import { fetchValues } from '../services/LandingPageServices';

const useUsPage = () => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [vision, setVision] = useState<Vision | null>(null);
  const [values, setValues] = useState<Value[]>([]); // Asegúrate de definir el tipo Value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsPageData = async () => {
      try {
        // Obtén los datos de Misión y Visión en paralelo
        const [missionData, visionData] = await Promise.all([fetchMission(), fetchVision()]);
        setMission(missionData);
        setVision(visionData);

      
        const valuesData = await fetchValues();
        setValues(valuesData);

      } catch (err) {
        console.error('Error al cargar los datos de Misión y Visión:', err);
        setError('Error al cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    getUsPageData();
  }, []);

  return { mission, vision, values, loading, error };
};

export default useUsPage;
