import { useState, useEffect } from 'react';
import { getCertificationNames } from '../services/LandingPageServices';

export const useCertificationNames = () => {
    const [certificationNames, setCertificationNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificationNames = async () => {
            try {
                const names = await getCertificationNames();
                setCertificationNames(names); // Guardamos los nombres de certificación
                setError(null); // Limpiamos cualquier error previo
            } catch (error) {
                setError('Error al cargar los nombres de certificación.');
                console.error('Error fetching certification names:', error);
            } finally {
                setLoading(false); // Finalizamos la carga
            }
        };

        fetchCertificationNames();
    }, []);

    return {
        certificationNames,
        loading,
        error,
    };
};
