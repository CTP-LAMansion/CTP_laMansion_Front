declare module '@config/driveConfig' {
  export type RoleType = 'Admin' | 'UDPManager' | 'ContentEditor' | 'RoomManager' | 
    'LabManager' | 'CertificationManager' | 'ConferenceRoomManager' | 'RoomandLabRequester';

  export const FolderConfig: Record<RoleType, string>;
}