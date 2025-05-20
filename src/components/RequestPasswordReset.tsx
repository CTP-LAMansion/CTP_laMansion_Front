import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetToken } from '../services/authService';

Modal.setAppElement('#root');

const RequestPasswordReset: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await sendPasswordResetToken(email);
            setMessage('Se ha enviado un código de seguridad a su correo electrónico.');
            setError(null);
            setIsModalOpen(true);
        } catch (error) {
            setMessage(null);
            setError('Ocurrió un error al enviar el código. Por favor, inténtelo de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRedirect = () => {
        setIsModalOpen(false);
        navigate('/reset-password');
    };
    
    const handleGoBack = () => {
      navigate('/login');
    };

    return (
        <div className="bg-white text-gray-800 flex justify-center items-center h-full">
            <div className="hidden lg:block w-1/2 h-screen">
                <img
                    src="https://i.ibb.co/dKVCLB2/ctp-m.jpg"
                    alt="Imagen de fondo"
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full  lg:w-1/2 h-full bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">Restablecer Contraseña</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : 'Enviar'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <button onClick={handleGoBack} className="text-sm text-blue-500 hover:underline">
                        Volver al inicio de sesión
                    </button>
                </div>
                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Código enviado"
                className="absolute inset-0 flex items-center justify-center z-[9999]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            >
                <div className="p-6 rounded-lg shadow-lg bg-white text-gray-800">
                    <h2 className="text-xl font-semibold text-blue-600">Código enviado</h2>
                    <p className="mt-4">
                        Se ha enviado un código de seguridad a su correo electrónico. Por favor, revise su bandeja de entrada y, si es necesario, la bandeja de spam.
                    </p>
                    <button
                        onClick={handleRedirect}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Restablecer mi contraseña
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default RequestPasswordReset;