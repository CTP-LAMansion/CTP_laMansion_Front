export enum RequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface RoomRequest {
  id_RoomRequest: number;          // Identificador único para la solicitud de sala
  managerName: string;             // Nombre del encargado
  managerLastName: string;         // Primer apellido del encargado
  managerLastName2: string;        // Segundo apellido del encargado
  course: string;                  // Curso asociado a la solicitud
  activityDescription: string;     // Descripción de la actividad
  needs: string;                   // Necesidades para la sala
  numberOfAttendees: number;       // Número de asistentes
  startDate: string;               // Fecha de inicio (ISO string)
  endDate: string;                 // Fecha de fin (ISO string)
  startTime: string;               // Hora de inicio
  endTime: string;                 // Hora de fin
  roomId: number;                  // ID de la sala solicitada
  userId: string;                  // ID del usuario que realiza la solicitud
  status?: RequestStatus;          // Estado de la solicitud (Pendiente, Aprobada, Rechazada)
  roomName?: string;               // Nombre de la sala (propiedad opcional)
}


