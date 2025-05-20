import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

Modal.setAppElement('#root');

const ResetPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        const minLength = 8;
        const maxLength = 128;
        
        if (password.length < minLength) errors.push(`La contraseña debe tener al menos ${minLength} caracteres.`);
        if (password.length > maxLength) errors.push(`La contraseña no puede exceder ${maxLength} caracteres.`);
        if (!/\d/.test(password)) errors.push("La contraseña debe contener al menos un número.");
        if (!/[a-z]/.test(password)) errors.push("La contraseña debe contener al menos una letra minúscula.");
        if (!/[A-Z]/.test(password)) errors.push("La contraseña debe contener al menos una letra mayúscula.");
        if (!/[^a-zA-Z0-9]/.test(password)) errors.push("La contraseña debe contener al menos un carácter especial.");

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !token || !newPassword || !confirmPassword) {
            setErrorMessage('Todos los campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        const validationErrors = validatePassword(newPassword);
        if (validationErrors.length > 0) {
            setPasswordErrors(validationErrors);
            return;
        }

        try {
            await resetPassword(email, token, newPassword);
            setSuccessMessage('Su contraseña ha sido restablecida exitosamente.');
            setErrorMessage(null);
            setIsModalOpen(true);
        } catch (error) {
            setSuccessMessage(null);
            setErrorMessage('Ocurrió un error. Por favor, inténtelo de nuevo.');
        }
    };

    const handleRedirectToLogin = () => {
        setIsModalOpen(false);
        navigate('/login');
    };

    return (
        <div className="bg-gray-100 text-gray-800 flex justify-center items-center h-screen">
            <div className="hidden lg:block w-1/2 h-screen">
                <img
                    src="https://i.ibb.co/dKVCLB2/ctp-m.jpg"
                    alt="Imagen de fondo"
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2 h-full bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-semibold mb-6">Restablecer Contraseña</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
                            placeholder="Correo electrónico"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="token" className="block mb-2">Código de Verificación</label>
                        <input
                            type="text"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
                            placeholder="Código de verificación"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block mb-2">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordErrors(validatePassword(e.target.value));
                            }}
                            className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
                            placeholder="Nueva contraseña"
                            required
                        />
                        {passwordErrors.length > 0 && (
                            <div className="text-xs text-red-500 mt-1">
                                {passwordErrors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
                            placeholder="Confirmar contraseña"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Restablecer Contraseña
                    </button>
                </form>

                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleRedirectToLogin}
                contentLabel="Contraseña restablecida"
                className="absolute inset-0 flex items-center justify-center z-[9999]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            >
                <div className="p-6 rounded-lg shadow-lg bg-white text-gray-800">
                    <h2 className="text-xl font-semibold text-blue-600">¡Contraseña restablecida!</h2>
                    <p className="mt-4">Su contraseña ha sido restablecida correctamente.</p>
                    <button
                        onClick={handleRedirectToLogin}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Iniciar sesión
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ResetPasswordForm;