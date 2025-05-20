import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaChartBar,
  FaCertificate,
  FaCartArrowDown,
  FaImage,
  FaCog
} from 'react-icons/fa';
import { MdRoom, MdScience } from 'react-icons/md';
import { GiTeacher, GiTakeMyMoney } from 'react-icons/gi';
import { IoIosConstruct } from 'react-icons/io';
import { BsJournal } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { useEvents } from '../../hooks/useEvents';
import { useAuthContext } from '../../hooks/useAuthContext';

const policies = {
  admin: ['Admin'],
  adminOrUDPManager: ['Admin', 'UDPManager'],
  adminOrContentEditor: ['Admin', 'ContentEditor'],
  roomManagement: ['Admin', 'RoomManager'],
  labManagement: ['Admin', 'LabManager'],
  certificationManagement: ['Admin', 'CertificationManager'],
  conferenceRoomManagement: ['Admin', 'ConferenceRoomManager'],
  requester: ['RoomandLabRequester'],
  allManagers: ['Admin', 'UDPManager', 'CertificationManager', 'LabManager', 
               'RoomManager', 'ContentEditor', 'ConferenceRoomManager']
};

const DashboardHome: React.FC = () => {
  const { events, loading, error } = useEvents();
  const { user } = useAuthContext();
  const maxUpcomingEvents = 3;

  // Obtener eventos próximos ordenados
  const upcomingEvents = events
    .filter(event => event.date && new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, maxUpcomingEvents);

  // Función para verificar roles
  const hasRole = (requiredRoles: string[]) => {
    return user?.roles?.some((role) => requiredRoles.includes(role));
  };

  // Componente para determinar qué acciones rápidas mostrar
  const renderQuickActions = () => {
    const actions = [];

    // Acción: Solicitar Sala (para requester)
    if (hasRole(policies.requester)) {
      actions.push(
        <QuickLink
          key="solicitar-sala"
          to="/dashboard/solicitar-sala"
          icon={<MdRoom className="text-blue-500" size={24} />}
          title="Solicitar Sala"
          description="Reserva de salas"
          color="blue"
        />
      );
    }

    // Acción: Solicitar Laboratorio (para requester)
    if (hasRole(policies.requester)) {
      actions.push(
        <QuickLink
          key="solicitar-laboratorio"
          to="/dashboard/solicitar-laboratorio"
          icon={<MdScience className="text-green-500" size={24} />}
          title="Solicitar Laboratorio"
          description="Reserva de laboratorios"
          color="green"
        />
      );
    }

    // Acción: Orden de Pedido (para requester)
    if (hasRole(policies.requester)) {
      actions.push(
        <QuickLink
          key="orden-pedido"
          to="/dashboard/orden-de-pedido"
          icon={<FaFileInvoice className="text-purple-500" size={24} />}
          title="Orden de Pedido"
          description="Solicitudes de compra"
          color="purple"
        />
      );
    }

    // Acciones para Admin
    if (hasRole(policies.admin)) {
      actions.push(
        <QuickLink
          key="gestion-roles"
          to="/dashboard/roles"
          icon={<FiUsers className="text-green-500" size={24} />}
          title="Gestión de Roles"
          description="Administrar permisos"
          color="green"
        />,
        <QuickLink
          key="crear-evento"
          to="/dashboard/eventos"
          icon={<IoIosConstruct className="text-orange-500" size={24} />}
          title="Crear Evento"
          description="Organizar actividades"
          color="orange"
        />,
        <QuickLink
          key="ordenes-pedido"
          to="/dashboard/ordenesdepedido"
          icon={<FaCartArrowDown className="text-red-500" size={24} />}
          title="Órdenes de Pedido"
          description="Administrar solicitudes"
          color="red"
        />,
        <QuickLink
          key="estadisticas"
          to="/dashboard/GraficoSalas"
          icon={<FaChartBar className="text-indigo-500" size={24} />}
          title="Estadísticas"
          description="Ver gráficos"
          color="indigo"
        />
      );
    }

    // Acciones para Gestión de Salas
    if (hasRole(policies.roomManagement)) {
      actions.push(
        <QuickLink
          key="solicitudes-salas"
          to="/dashboard/salas"
          icon={<MdRoom className="text-teal-500" size={24} />}
          title="Solicitudes Salas"
          description="Ver solicitudes"
          color="teal"
        />,
        <QuickLink
          key="administrar-salas"
          to="/dashboard/elaborar-salas"
          icon={<MdRoom className="text-cyan-500" size={24} />}
          title="Administrar Salas"
          description="Gestionar salas"
          color="cyan"
        />
      );
    }

    // Acciones para Gestión de Laboratorios
    if (hasRole(policies.labManagement)) {
      actions.push(
        <QuickLink
          key="solicitudes-labs"
          to="/dashboard/laboratorios"
          icon={<MdScience className="text-lime-500" size={24} />}
          title="Solicitudes Labs"
          description="Ver solicitudes"
          color="lime"
        />,
        <QuickLink
          key="administrar-labs"
          to="/dashboard/elaborar-laboratorios"
          icon={<MdScience className="text-emerald-500" size={24} />}
          title="Administrar Labs"
          description="Gestionar laboratorios"
          color="emerald"
        />
      );
    }

    // Acciones para Certificaciones
    if (hasRole(policies.certificationManagement)) {
      actions.push(
        <QuickLink
          key="certificaciones"
          to="/dashboard/certificaciones"
          icon={<FaCertificate className="text-amber-500" size={24} />}
          title="Certificaciones"
          description="Gestionar certificados"
          color="amber"
        />
      );
    }

    // Acciones para UDPs
    if (hasRole(policies.adminOrUDPManager)) {
      actions.push(
        <QuickLink
          key="udps"
          to="/dashboard/udps"
          icon={<GiTeacher className="text-violet-500" size={24} />}
          title="UDPs"
          description="Gestionar UDPs"
          color="violet"
        />,
        <QuickLink
          key="balance-udp"
          to="/dashboard/admin-udp-balance"
          icon={<GiTakeMyMoney className="text-fuchsia-500" size={24} />}
          title="Balance UDP"
          description="Ver balances"
          color="fuchsia"
        />
      );
    }

    // Acciones para Contenido Académico
    if (hasRole(policies.adminOrContentEditor)) {
      actions.push(
        <QuickLink
          key="eventos"
          to="/dashboard/eventos"
          icon={<IoIosConstruct className="text-orange-500" size={24} />}
          title="Eventos"
          description="Gestionar eventos"
          color="orange"
        />,
        <QuickLink
          key="especialidades"
          to="/dashboard/especialidades"
          icon={<BsJournal className="text-rose-500" size={24} />}
          title="Especialidades"
          description="Gestionar especialidades"
          color="rose"
        />,
        <QuickLink
          key="talleres"
          to="/dashboard/talleres"
          icon={<FaCog className="text-sky-500" size={24} />}
          title="Talleres"
          description="Gestionar talleres"
          color="sky"
        />,
        <QuickLink
          key="galeria"
          to="/dashboard/galeria"
          icon={<FaImage className="text-pink-500" size={24} />}
          title="Galería"
          description="Gestionar imágenes"
          color="pink"
        />
      );
    }

    return actions;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido al sistema de gestión del CTP La Mansión
        </p>
      </header>

      {/* Eventos Próximos */}
      <section className="mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-3 text-indigo-600" />
              Eventos Próximos
            </h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid gap-4">
                {upcomingEvents.map((event, index) => (
                  <EventCard 
                    key={index}
                    date={event.date}
                    title={event.title}
                    description={event.description}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay eventos próximos programados
              </div>
            )}
          </div>
          {upcomingEvents.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-right">
              <Link 
                to="/dashboard/eventos" 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Ver todos los eventos →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enlaces Rápidos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderQuickActions()}
        </div>
      </section>
    </div>
  );
};

// Componente de tarjeta de evento corregido
interface EventCardProps {
  date: string | Date;
  title: string;
  description?: string;
}

const EventCard: React.FC<EventCardProps> = ({ date, title, description }) => {
  // Convertir a Date si es string
  const eventDate = date instanceof Date ? date : new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(eventDate.getTime())) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Fecha inválida para el evento: {title}
      </div>
    );
  }

  return (
    <div className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
      <div className="bg-indigo-100 text-indigo-800 rounded-lg p-3 mr-4 text-center min-w-[70px]">
        <div className="font-bold text-lg">
          {eventDate.getDate()}
        </div>
        <div className="text-xs uppercase">
          {eventDate.toLocaleString('default', { month: 'short' })}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

// Componente reutilizable para los enlaces rápidos
interface QuickLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const QuickLink: React.FC<QuickLinkProps> = ({ to, icon, title, description, color }) => (
  <Link
    to={to}
    className={`bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-5 transition-all duration-200 hover:shadow-md hover:border-${color}-300 group`}
  >
    <div className="flex items-start">
      <div className={`p-3 rounded-lg bg-${color}-50 group-hover:bg-${color}-100 mr-4 transition-colors duration-200`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-semibold text-gray-800 group-hover:text-${color}-700 mb-1`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

export default DashboardHome;