import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationCode } from '../services/authService';

const VerificationForm = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (!userId) {
      setError('Falta el ID del usuario.');
      return;
    }

    try {
      await verifyEmail(userId, verificationCode);
      setSuccess(true);
      setError(null);
      sessionStorage.removeItem('userId');
    } catch (error) {
      setError('Error al verificar el código. Por favor, inténtalo de nuevo.');
      setSuccess(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId) {
      setError('Falta el ID del usuario.');
      return;
    }

    try {
      await resendVerificationCode(userId);
      setResendMessage('El código de verificación ha sido reenviado a tu correo electrónico.');
      setError(null);
    } catch (error) {
      setResendMessage(null);
      setError('Error al reenviar el código. Por favor, inténtalo de nuevo.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gray-100 text-gray-800 flex justify-center items-center h-screen">
      <div className="hidden lg:block w-1/2 h-screen">
        <img
          src="https://i.ibb.co/dKVCLB2/ctp-m.jpg"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2 h-full bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-6">Verificación de Correo Electrónico</h1>

        {success ? (
          <>
            <p className="text-green-600">¡Verificación exitosa! Ahora puedes acceder a tu cuenta.</p>
            <button
              onClick={handleLoginRedirect}
              className="mt-4 px-4 py-2 rounded-lg w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Iniciar sesión
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">Por favor, introduce el código de verificación que fue enviado a tu correo electrónico.</p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.trim())}
              placeholder="Ingresa el código de verificación"
              className="w-full mb-4 p-2 border rounded bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500"
            />
            <button
              onClick={handleVerification}
              className="px-4 py-2 rounded-lg w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Verificar
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-4">
              <p>¿No recibiste el código?</p>
              <button
                onClick={handleResendCode}
                className="mt-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Reenviar código
              </button>
              {resendMessage && <p className="text-green-600 mt-2">{resendMessage}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationForm;