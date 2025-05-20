import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRoomsAndRequests } from '../../hooks/useRooms';
import { useRoomRequest } from '../../hooks/useRoomRequest';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import ClipLoader from 'react-spinners/ClipLoader';
import { RoomRequest } from '../../types/RoomRequestType';

// Configurar moment en español
moment.locale('es');

const localizer = momentLocalizer(moment);

// Traducciones para el calendario
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
  showMore: (total: number) => `+ Ver más (${total})`
};

type RoomRequestFormField = {
  managerName: string;
  managerLastName: string;
  managerLastName2: string;
  course: string;
  activityDescription: string;
  numberOfAttendees: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  needs: string;
};

const RoomRequestPage: React.FC = () => {
  const { rooms, roomRequests, loading, error, fetchRoomRequestsData } = useRoomsAndRequests();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<{ id_Room: number; name: string; capacity: number; url_Image: string; description: string } | null>(null);
  const [activeModal, setActiveModal] = useState<"form" | "calendar" | "reservationDetails" | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<RoomRequest | null>(null);
  const { register, handleSubmit, reset } = useForm<RoomRequestFormField>();
  const { isSubmitting, submitRoomRequest } = useRoomRequest();

  const today = moment().format("YYYY-MM-DD");

  const notifySuccess = () => toast.success('Solicitud de sala enviada exitosamente!');
  const notifyError = (message: string) => toast.error(message);

  const onSubmit = async (data: RoomRequestFormField) => {
    if (!selectedRoom) {
      notifyError('No se pudo obtener la sala seleccionada.');
      return;
    }

    if (!user) {
      notifyError('Usuario no autenticado');
      return;
    }

    const startDateTime = moment(`${data.startDate} ${data.startTime}`, "YYYY-MM-DD HH:mm");
    const endDateTime = moment(`${data.endDate} ${data.endTime}`, "YYYY-MM-DD HH:mm");

    if (startDateTime.day() === 6 || startDateTime.day() === 0) {
      notifyError("No se permiten reservas los fines de semana (sábado y domingo).");
      return;
    }
    if (startDateTime.isBefore(moment())) {
      notifyError("La fecha de inicio no puede ser anterior a la fecha actual.");
      return;
    }
    if (startDateTime.isSameOrAfter(endDateTime)) {
      notifyError("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    const duration = moment.duration(endDateTime.diff(startDateTime));
    if (duration.asMinutes() < 30) {
      notifyError("La duración mínima de la solicitud es de 30 minutos.");
      return;
    }
    if (duration.asHours() > 8) {
      notifyError("La duración máxima de la solicitud es de 8 horas.");
      return;
    }

    const roomRequest = {
      ...data,
      roomId: selectedRoom.id_Room,
      userId: user.id.toString(),
      status: 0,
    };

    try {
      await submitRoomRequest(roomRequest);
      reset();
      notifySuccess();
      setSelectedRoom(null);
      setActiveModal(null);
      fetchRoomRequestsData();
    } catch {
      notifyError('Error al enviar la solicitud.');
    }
  };
  const renderInputField = (
    id: keyof RoomRequestFormField,
    label: string,
    placeholder: string,
    type = 'text',
    min?: string,
    max?: string,
    maxLength?: number
  ) => (
    <div className="flex flex-col mb-4 w-full md:w-1/2 px-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        min={min}
        max={max}
        maxLength={maxLength}
        {...register(id, { 
          required: `${label} es obligatorio`,
          maxLength: maxLength ? { value: maxLength, message: `Máximo ${maxLength} caracteres` } : undefined 
        })}
        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2"
      />
      {maxLength && <p className="text-xs text-gray-500 mt-1">Máximo {maxLength} caracteres</p>}
    </div>
  );

  const renderDropdownField = (
    id: keyof RoomRequestFormField,
    label: string,
    options: number[]
  ) => (
    <div className="flex flex-col mb-4 w-full md:w-1/2 px-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">{label}</label>
      <select
        id={id}
        {...register(id, { required: 'Este campo es obligatorio' })}
        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const RequestFormModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative z-10 overflow-y-auto max-h-screen">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-2xl font-bold">&times;</button>
        <h3 className="text-lg font-semibold mb-4 text-center">Solicitud para {selectedRoom?.name}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap mt-4">          <div className="w-full flex flex-wrap">
            {renderInputField('managerName', 'Nombre del Encargado', 'Juan', 'text', undefined, undefined, 50)}
            {renderInputField('managerLastName', 'Primer Apellido', 'Pérez', 'text', undefined, undefined, 50)}
          </div>
          <div className="w-full flex flex-wrap">
            {renderInputField('managerLastName2', 'Segundo Apellido', 'Rodríguez', 'text', undefined, undefined, 50)}
            {renderInputField('course', 'Curso', 'Matemáticas', 'text', undefined, undefined, 100)}
          </div>
          <div className="w-full flex flex-wrap">
            {renderInputField('activityDescription', 'Descripción de la Actividad', 'Clase de laboratorio', 'text', undefined, undefined, 200)}
            {renderDropdownField(
              'numberOfAttendees',
              'Número de Asistentes',
              Array.from({ length: selectedRoom?.capacity || 10 }, (_, i) => i + 1)
            )}
          </div>          <div className="w-full flex flex-wrap">
            {renderInputField('startDate', 'Fecha de Inicio', '', 'date', today)}
            {renderInputField('startTime', 'Hora de Inicio', '', 'time')}
          </div>
          <div className="w-full flex flex-wrap">
            {renderInputField('endDate', 'Fecha de Fin', '', 'date', today)}
            {renderInputField('endTime', 'Hora de Fin', '', 'time')}
          </div><div className="w-full px-2 mb-4">
            <label htmlFor="needs" className="block text-sm font-medium text-gray-900">Necesidades</label>
            <textarea
              id="needs"
              placeholder="Equipo de sonido, proyector, etc."
              maxLength={500}
              {...register('needs')}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2 h-24"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Máximo 500 caracteres</p>
          </div>
          <div className="w-full px-2 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ReservationDetailsModal = ({ reservation, onClose }: { reservation: RoomRequest, onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-2xl font-bold">&times;</button>
        <h3 className="text-lg font-semibold mb-4 text-center">Detalles de la Reserva</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Encargado:</h4>
            <p className="text-gray-700">{reservation.managerName} {reservation.managerLastName} {reservation.managerLastName2}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Curso:</h4>
            <p className="text-gray-700">{reservation.course}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Actividad:</h4>
            <p className="text-gray-700">{reservation.activityDescription}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Número de Asistentes:</h4>
            <p className="text-gray-700">{reservation.numberOfAttendees}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Fecha:</h4>
            <p className="text-gray-700">{moment(reservation.startDate).format('dddd, LL')}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Horario:</h4>
            <p className="text-gray-700">
              {moment(reservation.startTime, 'HH:mm').format('LT')} - {moment(reservation.endTime, 'HH:mm').format('LT')}
            </p>
          </div>

          {reservation.needs && (
            <div>
              <h4 className="font-medium text-gray-900">Necesidades Especiales:</h4>
              <p className="text-gray-700">{reservation.needs}</p>
            </div>
          )}
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );

  const events = roomRequests
    .filter(request => request.roomId === selectedRoom?.id_Room && request.status === 1)
    .map(request => ({
      title: `Reservado: ${request.course} - ${request.managerName}`,
      start: moment(`${request.startDate} ${request.startTime}`, "YYYY-MM-DD HH:mm").toDate(),
      end: moment(`${request.endDate} ${request.endTime}`, "YYYY-MM-DD HH:mm").toDate(),
      resource: request
    }));

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">Solicitar Sala</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#3b82f6" size={100} />
        </div>}
        {error && <p className="text-red-600">{error}</p>}
        {Array.isArray(rooms) &&
          rooms
            .filter(room => room.isActive)
            .map((room) => (
              <div
                key={room.id_Room}
                className="p-4 border border-gray-300 rounded-lg shadow-md flex flex-col bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={room.url_Image}
                  alt={room.name}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                <p className="flex-grow text-sm text-gray-700 mb-2">{room.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Capacidad:</strong> {room.capacity} personas
                </p>
                <div className="mt-4 flex flex-col space-y-2">
                  <button
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setSelectedRoom(room);
                      setActiveModal("calendar");
                    }}
                  >
                    Ver Disponibilidad
                  </button>
                  <button
                    className="w-full text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setSelectedRoom(room);
                      setActiveModal("form");
                    }}
                  >
                    Reservar Sala
                  </button>
                </div>
              </div>
            ))}
      </div>

      {activeModal === "calendar" && selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Disponibilidad: {selectedRoom.name}</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow min-h-0 relative">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={['month', 'week', 'day']}
                style={{ height: '100%' }}
                className="border border-gray-200 rounded-lg"
                messages={messages}
                onSelectEvent={(event) => {
                  setSelectedReservation(event.resource);
                  setActiveModal("reservationDetails");
                }}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '2px 4px'
                  }
                })}
                dayPropGetter={() => ({
                  style: {
                    borderRight: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb'
                  }
                })}
              />
            </div>

            <div className="mt-4 flex justify-between border-t pt-4">
              <button
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setActiveModal("form")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nueva Reserva
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setActiveModal(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "form" && selectedRoom && (
        <RequestFormModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "reservationDetails" && selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={() => setActiveModal("calendar")}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default RoomRequestPage;