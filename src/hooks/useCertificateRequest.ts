import { useState, useEffect } from 'react';
import { getDeliveryMethods, getCertificationNames, submitCertificateRequest } from '../services/LandingPageServices';

export const useCertificateRequest = () => {
    const [deliveryMethods, setDeliveryMethods] = useState<{ id: number; name: string }[]>([]);
    const [certificationNames, setCertificationNames] = useState<{ id: number; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deliveryMethodsData, certificationNamesData] = await Promise.all([
                    getDeliveryMethods(),
                    getCertificationNames(),
                ]);
    
                // Transformar los datos de métodos de entrega para que tengan `id` y `name`
                const transformedDeliveryMethods = (deliveryMethodsData as string[]).map((name, index) => ({
                    id: index + 1,
                    name: name,
                }));

                setDeliveryMethods(transformedDeliveryMethods);
                setCertificationNames(certificationNamesData);
            } catch (error) {
                setError('Error al cargar los datos de la API.');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    // Función para manejar el envío de la solicitud
    const submitRequest = async (formData: {
        studentName: string;
        studentIdentification: string;
        guardianName: string;
        guardianIdentification: string;
        email: string;
        phoneNumber: string;
        deliveryMethod: number;
        certificationName: string;
    }) => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await submitCertificateRequest(formData);
            setSuccess(true);  // Marcamos como éxito si la solicitud fue enviada
        } catch (error) {
            setError('Error al enviar la solicitud.');
            console.error('Error submitting request:', error);
        } finally {
            setIsSubmitting(false);  // Deshabilitamos el estado de envío
        }
    };

    return {
        deliveryMethods,
        certificationNames,
        isSubmitting,
        error,
        success,
        submitRequest,
    };
};
