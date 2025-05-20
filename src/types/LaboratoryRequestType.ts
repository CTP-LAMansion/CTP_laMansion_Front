export enum RequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface LabRequest {
  id_LaboratoryRequest: number;      // Identificador único para la solicitud de laboratorio
  laboratoryId: number;              // ID del laboratorio solicitado
  managerName: string;               // Nombre del encargado
  managerLastName: string;           // Primer apellido del encargado
  managerLastName2: string;          // Segundo apellido del encargado
  course: string;                    // Curso asociado a la solicitud
  activityDescription: string;       // Descripción de la actividad
  needs: string;                     // Necesidades para el laboratorio
  numberOfAttendees: number;         // Número de asistentes
  startDate: string;                 // Fecha de inicio (ISO string)
  endDate: string;                   // Fecha de fin (ISO string)
  startTime: string;                 // Hora de inicio
  endTime: string;                   // Hora de fin
  userId: string;                    // ID del usuario que realiza la solicitud
  status?: RequestStatus;            // Estado de la solicitud (Pendiente, Aprobada, Rechazada)
  labName?: string;                  // Nombre del laboratorio (propiedad opcional)
  labIsActive?: boolean;             // Estado del laboratorio (propiedad opcional)
  labCapacity?: number;              // Capacidad del laboratorio (propiedad opcional)
}

export type Laboratory = {
  id_Laboratory: number;
  name: string;
  description: string;
  capacity: number;
  url_Image: string;
  isActive:boolean;
};

