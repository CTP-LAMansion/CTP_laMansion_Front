import { useState, useEffect } from 'react';
import { getDeliveryMethods } from '../services/LandingPageServices';

export const useDeliveryMethods = () => {
    const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Llamada a la API para obtener los métodos de entrega
        const fetchDeliveryMethods = async () => {
            try {
                const methods = await getDeliveryMethods();
                setDeliveryMethods(methods); // Almacenar los métodos obtenidos
                setError(null); // Si es exitoso, limpiar el error
            } catch (error) {
                setError('Error al cargar los métodos de entrega.');
                console.error('Error fetching delivery methods:', error);
            } finally {
                setLoading(false); // Cambiar el estado de carga
            }
        };

        fetchDeliveryMethods();
    }, []);

    return {
        deliveryMethods,
        loading,
        error,
    };
};
