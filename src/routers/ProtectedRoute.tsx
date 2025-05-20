import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Lista de roles necesarios para acceder a la ruta
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const auth = useContext(AuthContext);

  if (!auth?.token) {
    // Si el usuario no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  // Si hay roles requeridos y el usuario no los tiene, redirige a una página de no autorizado
  if (requiredRoles && !requiredRoles.some(role => auth.user?.roles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  // Si el usuario está autenticado y tiene los roles necesarios, renderiza los children (el contenido protegido)
  return <>{children}</>;
};

export default ProtectedRoute;
