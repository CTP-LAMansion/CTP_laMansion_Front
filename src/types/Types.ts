export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  url_Image: string;
}

export interface AboutUsContent {
  id: number;
  title: string;
  description: string;
  url_Image: string;
}
export interface Location {
  id: number;
  id_Location: number;
  addres: string;
  schedule: string;
  email: string;
  phoneNumber: string;
}

export interface OurService {
  id: number;
  title: string;
  icon: string; 
  description:string;
}


export interface Mission {
  id: number;
  title: string;
  description: string;
  url_Image:string;
}

export interface Vision {
  id: number;
  title: string;
  description: string;
  url_Image:string;
}

export interface Value {
  id: number;
  title: string;
  description: string;
  icon: string; 
}


export interface Workshop {
  id: number;
  title: string;
  description: string;
  especiality: string;
  url_Image: string;

}

export interface Speciality {
  id: number;
  title: string;
  description: string;
  url_Image: string;
  Url_Details:string;
}


export interface Room {
  id_Room: number;      // Este es el identificador de la sala
  name: string;
  description: string;
  capacity: number;
  url_Image: string;   // URL opcional para la imagen de la sala
  isConferenceRoom: boolean;
}
export interface Laboratory {
  id_Laboratory: number;
  name: string;
  description: string;
  capacity: number;
  url_Image: string;
  isActive:boolean;
}


export interface CertificationRequest {
  id: number;
  status: number;
  requestDate: string;
  studentName: string;
  studentLastName1: string;
  studentLastName2: string;
  studentIdentification: string;
  guardianName: string;
  guardianLastName1: string;
  guardianLastName2: string;
  guardianIdentification: string;
  email: string;
  phoneNumber: string;
  deliveryMethod: number | string;
  certificationId: number; // Asegúrate de tener un ID aquí
  certificationNameId: number;
  responseDate?: string; // Añade este campo
}


export interface Room {
id: number;               // Unique identifier for the room
id_Room: number;          // Room ID for internal use or reference
name: string;             // Name of the room
description: string;      // Description of the room
capacity: number;         // Capacity of the room
url_Image: string;        // URL for the room image
isConferenceRoom: boolean; // Flag indicating if the room is a conference room
isActive:boolean;
roomRequests: any;  // Flag indicating if the room is a conference room
}

export interface UserProfileType {
id: number;
name: string,
lastName: string,
lastName2: string,
email: string,
phoneNumber: string,
password: string,
profilePicture: string,
emergencyPhoneNumber: string,
address: string,
institutionJoinDate: string | Date,
workJoinDate: string | Date
}

export interface UDP {
  id_UDP: number;
  title: string;
  description: string;
  area: string;
  balance: number;
  userId: number;
  userName?: string;
  userLastName?: string;
  userLastName2?: string;
  useremail?: string;
  userphoneNumber?: string;
}

export interface Gallery {
  id_Gallery: number;
  title: string;
  url_Image: string;  // Definido como url_Image en la interfaz
  categoryId: number;
  category?: Category;
}

export interface Category {
  id_Category: number;
  name: string;
  galleries?: Gallery[]; // Opcional para evitar referencias circulares al serializar
}

// Para el formulario de cambio de contraseña
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Para representar las solicitudes del usuario
export interface UserRequest {
  id: number;
  type: 'Laboratorio' | 'Sala';
  resourceName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: number;
  activityDescription: string;
  managerName: string;
  managerLastName: string;
  managerLastName2: string;
  numberOfAttendees: number;
  needs: string;
}