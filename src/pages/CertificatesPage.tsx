import { useForm } from 'react-hook-form';
import { useCertificateRequest } from '../hooks/useCertificateRequest';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, KeyboardEvent, ChangeEvent } from 'react';

type FormData = {
    studentName: string;
    studentLastName1: string;
    studentLastName2: string;
    studentId: string;
    guardianName: string;
    guardianLastName1: string;
    guardianLastName2: string;
    EncargadoId: string;
    email: string;
    phoneNumber: string;
    deliveryMethod: number;
    certificationType: string;
};

type CertificationName = {
    id: number;
    name: string;
};

const CertificatesPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const { deliveryMethods, certificationNames, isSubmitting, submitRequest } = useCertificateRequest();
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<number | null>(null);
    const [selectedCertificationType, setSelectedCertificationType] = useState<string>('');

    const notifySuccess = () => toast.success('Solicitud realizada correctamente!');
    const notifyError = () => toast.error('Error al realizar la solicitud.');

    // Patrones de validación
    const namePattern = {
        value: /^[A-Za-zÀ-ÿ\s]+$/,
        message: 'Solo se permiten letras y espacios'
    };
    
    const idPattern = {
        value: /^[0-9]{9}$/,
        message: 'La cédula debe tener exactamente 9 dígitos numéricos'
    };
    
    const phonePattern = {
        value: /^[0-9]{8}$/,
        message: 'El número telefónico debe tener exactamente 8 dígitos numéricos'
    };
    
    const emailPattern = {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Introduce un correo electrónico válido'
    };

    const onSubmit = (data: FormData) => {
        const requestData = {
            studentName: data.studentName,
            studentLastName1: data.studentLastName1,
            studentLastName2: data.studentLastName2,
            studentIdentification: data.studentId,
            guardianName: data.guardianName,
            guardianLastName1: data.guardianLastName1,
            guardianLastName2: data.guardianLastName2,
            guardianIdentification: data.EncargadoId,
            email: data.email,
            phoneNumber: data.phoneNumber,
            deliveryMethod: data.deliveryMethod,
            certificationName: data.certificationType,
        };

        submitRequest(requestData)
            .then(() => {
                reset();
                setSelectedDeliveryMethod(null);
                setSelectedCertificationType('');
                notifySuccess();
            })
            .catch(() => {
                notifyError();
            });
    };

    // Función para prevenir caracteres no numéricos en el teléfono
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        // Permitir: backspace, delete, tab, escape, enter y .
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Permitir: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Bloquear cualquier tecla que no sea número
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    // Función para filtrar caracteres no numéricos en cambios de input
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        e.target.value = value.replace(/[^\d]/g, '').slice(0, 8);
    };    // Función para filtrar caracteres no numéricos en campos de IDs
    const handleIdChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        e.target.value = value.replace(/[^\d]/g, '').slice(0, 9);
    };
      const renderInputField = (
        id: keyof FormData,
        label: string,
        placeholder: string,
        validation: object,
        type: string = 'text'
    ) => (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={id} className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
                {(id === 'studentId' || id === 'EncargadoId') && (
                    <span className="text-xs text-green-600">Solo números (9 dígitos)</span>
                )}
                {type === 'tel' && (
                    <span className="text-xs text-green-600">Solo números (8 dígitos)</span>
                )}
            </div>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                {...register(id, validation)}
                onKeyDown={(id === 'studentId' || id === 'EncargadoId' || type === 'tel') ? handleKeyDown : undefined}
                onChange={
                    type === 'tel' 
                    ? handlePhoneChange 
                    : (id === 'studentId' || id === 'EncargadoId') 
                        ? handleIdChange 
                        : undefined
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900 text-sm transition-all duration-200"
            />
            {errors[id]?.message && <p className="mt-1 text-xs text-red-500">{errors[id]?.message as string}</p>}
        </div>
    );

    const isDigitalDelivery = selectedDeliveryMethod === 0; // Digital is 0
    const isTitleCertification = selectedCertificationType.toLowerCase().includes('título');
    const showWarning = isDigitalDelivery && isTitleCertification;

    return (
        <>
            <Navbar />
            <main className="flex flex-col min-h-screen mt-12 bg-gradient-to-b from-gray-50 to-gray-100">
                <section className="flex-grow flex items-center justify-center px-4 py-20">
                    <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            Solicitud de Certificado
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    Información del Estudiante
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {renderInputField('studentId', 'Cédula del Estudiante', '102340567', { 
                                        required: 'La cédula del estudiante es requerida',
                                        pattern: idPattern,
                                        maxLength: { value: 9, message: 'La cédula no puede tener más de 9 dígitos' }
                                    }, 'text')}
                                    
                                    {renderInputField('studentName', 'Nombre del Estudiante', 'Juan', { 
                                        required: 'El nombre del estudiante es requerido',
                                        pattern: namePattern,
                                        maxLength: { value: 20, message: 'El nombre no puede exceder los 20 caracteres' }
                                    })}
                                    
                                    {renderInputField('studentLastName1', 'Primer Apellido del Estudiante', 'Pérez', { 
                                        required: 'El primer apellido es requerido',
                                        pattern: namePattern,
                                        maxLength: { value: 20, message: 'El apellido no puede exceder los 20 caracteres' }
                                    })}
                                    
                                    {renderInputField('studentLastName2', 'Segundo Apellido del Estudiante', 'Rodríguez', { 
                                        required: 'El segundo apellido es requerido',
                                        pattern: namePattern,
                                        maxLength: { value: 20, message: 'El apellido no puede exceder los 20 caracteres' }
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Información del Encargado
                                    </h4>
                                    <p className="text-m text-gray-500 italic">*Opcional para estudiantes egresados</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {renderInputField('EncargadoId', 'Cédula del Encargado', '102340567', {
                                        pattern: idPattern,
                                        maxLength: { value: 9, message: 'La cédula no puede tener más de 9 dígitos' }
                                    }, 'text')}
                                    
                                    {renderInputField('guardianName', 'Nombre del Encargado', 'Luis', {
                                        pattern: namePattern,
                                        maxLength: { value: 50, message: 'El nombre no puede exceder los 50 caracteres' }
                                    })}
                                    
                                    {renderInputField('guardianLastName1', 'Primer Apellido del Encargado', 'Pérez', {
                                        pattern: namePattern,
                                        maxLength: { value: 50, message: 'El apellido no puede exceder los 50 caracteres' }
                                    })}
                                    
                                    {renderInputField('guardianLastName2', 'Segundo Apellido del Encargado', 'Rodríguez', {
                                        pattern: namePattern,
                                        maxLength: { value: 50, message: 'El apellido no puede exceder los 50 caracteres' }
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    Información de Contacto
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {renderInputField('email', 'Email', 'name@gmail.com', { 
                                        required: 'El e-mail es requerido',
                                        pattern: emailPattern,
                                        maxLength: { value: 100, message: 'El correo no puede exceder los 100 caracteres' }
                                    }, 'email')}
                                    
                                    {renderInputField('phoneNumber', 'Teléfono', '12345678', { 
                                        required: 'El teléfono es requerido',
                                        pattern: phonePattern
                                    }, 'tel')}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    Detalles de la Solicitud
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="certificationType" className="block mb-1 text-sm font-semibold text-gray-700">
                                            Tipo de Certificación
                                        </label>
                                        {certificationNames.length === 0 ? (
                                            <p className="text-sm text-gray-500">Cargando tipos de certificación...</p>
                                        ) : (
                                            <select
                                                id="certificationType"
                                                {...register('certificationType', { required: 'El tipo de certificación es requerido' })}
                                                onChange={(e) => setSelectedCertificationType(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900 text-sm transition-all duration-200"
                                            >
                                                <option value="">Selecciona el Certificado</option>
                                                {certificationNames.map((cert: CertificationName) => (
                                                    <option key={cert.id} value={cert.name}>
                                                        {cert.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {errors.certificationType && <p className="mt-1 text-xs text-red-500">{errors.certificationType.message as string}</p>}
                                        {showWarning && (
                                            <p className="mt-1 text-sm text-yellow-600 bg-yellow-100 p-2 rounded">
                                                Advertencia: Los títulos solo pueden ser solicitados de manera física.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="deliveryMethod" className="block mb-1 text-sm font-semibold text-gray-700">
                                            Método de Entrega
                                        </label>
                                        {deliveryMethods.length === 0 ? (
                                            <p className="text-sm text-gray-500">Cargando métodos de entrega...</p>
                                        ) : (
                                            <select
                                                id="deliveryMethod"
                                                {...register('deliveryMethod', { required: 'Método de entrega es requerido' })}
                                                onChange={(e) => setSelectedDeliveryMethod(Number(e.target.value))}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900 text-sm transition-all duration-200"
                                            >
                                                <option value="">Selecciona el Método de Entrega</option>
                                                {deliveryMethods.map((method, index) => (
                                                    <option key={index} value={index}>
                                                        {method.name}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                        )}
                                        {errors.deliveryMethod && <p className="mt-1 text-xs text-red-500">{errors.deliveryMethod.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 font-semibold rounded-lg text-sm shadow-md transition-all duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || showWarning}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                                </button>
                            </div>
                        </form>
                        
                    </div>
                </section>
            </main>
            <ToastContainer />
            <Footer />
        </>
    );
};

export default CertificatesPage;