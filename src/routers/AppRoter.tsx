import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import ProtectedRoute from './ProtectedRoute'; // Componente de rutas protegidas
import { AuthProvider } from '../contexts/AuthContext';
import UserProfile from '../DashboardPages/Main/UserProfile';
import DashboardHome from '../DashboardPages/Main/DashboardHome';
import AcceptedRejectedChart from '../DashboardPages/AcceptedRejectedChart';
import NotFound from '../pages/NotFound'; // Importar la página 404
import UDPsPages from '../components/UDPsPages';
import UnitOfMeasurePage from '../DashboardPages/CRUD/UnitOfMeasure/UnitOfMeasurePage';

const HomePage = React.lazy(() => import('../pages/HomePage'));
const SpecialitiesPage = React.lazy(() => import('../components/SpecialitiesPage'));
const UsPage = React.lazy(() => import('../components/UsPage'));
const Events = React.lazy(() => import('../components/Events'));
const WorkshopsPage = React.lazy(() => import('../components/WorkshopsPage'));
const CertificatesPage = React.lazy(() => import('../pages/CertificatesPage'));
const DashboardLayout = React.lazy(() => import('../layouts/DashboardLayout'));
const CertificacionesPage = React.lazy(() => import('../DashboardPages/Managing/CertificationRequestsTable'));
const Register = React.lazy(() => import('../components/RegisterForm'));
const VerificationForm = React.lazy(() => import('../components/VerificationForm'));
const LoginForm = React.lazy(() => import('../components/LoginForm'));
const RequestPasswordReset = React.lazy(() => import('../components/RequestPasswordReset'));
const ResetPasswordForm = React.lazy(() => import('../components/ResetPasswordForm'));
const SalasPage = React.lazy(() => import('../DashboardPages/Managing/ManageRoomRequests'));
const RoomsPage = React.lazy(() => import('../DashboardPages/CRUD/Rooms/RoomsPage'));
const LabRequestPage = React.lazy(() => import('../DashboardPages/Managing/ManageLabRequests'));
const EventosPage = React.lazy(() => import('../DashboardPages/CRUD/Eventos/EventosPage'));
const UDPsPage = React.lazy(() => import('../DashboardPages/CRUD/UDPs/UDPsPage'));
const SpecialitiesPageD = React.lazy(() => import('../DashboardPages/CRUD/Specialities/SpecialitiesPageD'));
const TalleresPage = React.lazy(() => import('../DashboardPages/CRUD/Workshops/WorkshopsPageD'));
const ElaborarLaboratoriosPage = React.lazy(() => import('../DashboardPages/CRUD/Labs/LaboratoriesPage'));
const RolesManagement = React.lazy(() => import('../DashboardPages/Managing/Rolesmanagement'));
const SolicitarSala = React.lazy(() => import('../DashboardPages/Requests/RoomRequestPage'));
const SolicitarLaboratorio = React.lazy(() => import('../DashboardPages/Requests/LabRequestPage'));
const Unauthorized = React.lazy(() => import('../pages/UnauthorizedPage')); // Página de no autorizado
const OrderComponent = React.lazy(() => import('../DashboardPages/Requests/OrderComponent'));
const UpdateUDPBalanceComponent = React.lazy(() => import('../DashboardPages/Managing/UpdateUDPBalanceComponent'));
const OrdenesDePedido = React.lazy(() => import('../DashboardPages/Managing/ManageOrders'));
// Galería pública
const GalleryPage = React.lazy(() => import('../pages/GalleryPage'));
// Gestión de galería admin
const GalleryAdminPage = React.lazy(() => import('../DashboardPages/CRUD/GalleryCategory/GalleryPage'));
// Gestión de documentos y manuales
const GuidePage = React.lazy(() => import('../DashboardPages/Guide/GuidePage'));

// Define los nombres de políticas para usarlos en las rutas
const policies = {
  admin: ['Admin'],
  adminOrUDPManager: ['Admin', 'UDPManager'],
  adminOrContentEditor: ['Admin', 'ContentEditor'],
  roomManagement: ['Admin', 'RoomManager'],
  labManagement: ['Admin', 'LabManager'],
  certificationManagement: ['Admin', 'CertificationManager'],
  conferenceRoomManagement: ['Admin', 'ConferenceRoomManager'],
  roomAndLabRequestManagement: ['Admin', 'UDPManager', 'RoomManager', 'LabManager'],
  requester: ['RoomandLabRequester'], 
  allManagers: ['Admin', 'UDPManager', 'CertificationManager', 'LabManager', 
               'RoomManager', 'ContentEditor', 'ConferenceRoomManager']
};

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <ClipLoader color="#3b82f6" size={100} />
            </div>
          }
        >
          <Routes>
            {/* Rutas de Páginas Principales */}
            <Route path="/" element={<HomePage />} />
            <Route path="/specialities" element={<SpecialitiesPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/us" element={<UsPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerificationForm />} />
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/udps" element={<UDPsPages />} />
            <Route path="/gallery" element={<GalleryPage />} />

            {/* Ruta de No Autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rutas del Dashboard protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Home - accesible para todos los usuarios autenticados */}
              <Route index element={<DashboardHome />} />
              
              {/* Perfil de usuario - accesible para todos los usuarios autenticados */}
              <Route path="perfil" element={<UserProfile />} />
              
              {/* === RUTAS ADMINISTRATIVAS === */}
              
              {/* Órdenes de pedido - Admin only */}
              <Route
                path="ordenesdepedido"
                element={
                  <ProtectedRoute requiredRoles={policies.admin}>
                    <OrdenesDePedido />
                  </ProtectedRoute>
                }
              />
              
              {/* Roles - Admin only */}
              <Route
                path="roles"
                element={
                  <ProtectedRoute requiredRoles={policies.admin}>
                    <RolesManagement />
                  </ProtectedRoute>
                }
              />
              
              {/* Gráficos de estadísticas - Admin only */}
              <Route
                path="GraficoSalas"
                element={
                  <ProtectedRoute requiredRoles={policies.admin}>
                    <AcceptedRejectedChart />
                  </ProtectedRoute>
                }
              />
              
              {/* === GESTIÓN DE UDPS === */}
              
              {/* UDPs - AdminOrUDPManagerPolicy */}
              <Route
                path="udps"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrUDPManager}>
                    <UDPsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Actualización de balance UDP - AdminOrUDPManagerPolicy */}
              <Route
                path="admin-udp-balance"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrUDPManager}>
                    <UpdateUDPBalanceComponent />
                  </ProtectedRoute>
                }
              />
              
              {/* === GESTIÓN DE CONTENIDO === */}
              
              {/* Eventos - AdminOrContentEditorPolicy */}
              <Route
                path="eventos"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrContentEditor}>
                    <EventosPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Especialidades - AdminOrContentEditorPolicy */}
              <Route
                path="especialidades"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrContentEditor}>
                    <SpecialitiesPageD />
                  </ProtectedRoute>
                }
              />
              
              {/* Talleres - AdminOrContentEditorPolicy */}
              <Route
                path="talleres"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrContentEditor}>
                    <TalleresPage />
                  </ProtectedRoute>
                }
              />

              {/* Unidades de Medida - AdminOrContentEditorPolicy */}
              <Route
                path="unidades-medida"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrContentEditor}>
                    <UnitOfMeasurePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Galería - AdminOrContentEditorPolicy */}
              <Route
                path="galeria"
                element={
                  <ProtectedRoute requiredRoles={policies.adminOrContentEditor}>
                    <GalleryAdminPage />
                  </ProtectedRoute>
                }
              />
              
              {/* === GESTIÓN DE SALAS === */}
              
              {/* CRUD de Salas - RoomManagementPolicy */}
              <Route
                path="elaborar-salas"
                element={
                  <ProtectedRoute requiredRoles={policies.roomManagement}>
                    <RoomsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Solicitudes de Salas - RoomManagementPolicy */}
              <Route
                path="salas"
                element={
                  <ProtectedRoute requiredRoles={policies.roomManagement}>
                    <SalasPage />
                  </ProtectedRoute>
                }
              />
              
              {/* === GESTIÓN DE LABORATORIOS === */}
              
              {/* CRUD de Laboratorios - LabManagementPolicy */}
              <Route
                path="elaborar-laboratorios"
                element={
                  <ProtectedRoute requiredRoles={policies.labManagement}>
                    <ElaborarLaboratoriosPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Solicitudes de Laboratorios - LabManagementPolicy */}
              <Route
                path="laboratorios"
                element={
                  <ProtectedRoute requiredRoles={policies.labManagement}>
                    <LabRequestPage />
                  </ProtectedRoute>
                }
              />
              
              {/* === GESTIÓN DE CERTIFICACIONES === */}
              
              {/* Certificaciones - CertificationManagementPolicy */}
              <Route
                path="certificaciones"
                element={
                  <ProtectedRoute requiredRoles={policies.certificationManagement}>
                    <CertificacionesPage />
                  </ProtectedRoute>
                }
              />
              
              {/* === SOLICITUDES DE USUARIO === */}
              
              {/* Solicitudes de Sala - Para RoomandLabRequester */}
              <Route
                path="solicitar-sala"
                element={
                  <ProtectedRoute requiredRoles={policies.requester}>
                    <SolicitarSala />
                  </ProtectedRoute>
                }
              />
              
              {/* Solicitudes de Laboratorio - Para RoomandLabRequester */}
              <Route
                path="solicitar-laboratorio"
                element={
                  <ProtectedRoute requiredRoles={policies.requester}>
                    <SolicitarLaboratorio />
                  </ProtectedRoute>
                }
              />
              
              {/* Orden de pedido - Para RoomandLabRequester */}
              <Route
                path="orden-de-pedido"
                element={
                  <ProtectedRoute requiredRoles={policies.requester}>
                    <OrderComponent />
                  </ProtectedRoute>
                }
              />

              {/* Documentos y Manuales - Para todos los managers */}
              <Route
                path="documents"
                element={
                  <ProtectedRoute requiredRoles={policies.allManagers}>
                    <GuidePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Ruta para Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;