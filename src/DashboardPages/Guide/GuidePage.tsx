import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FolderConfig } from '../../config/driveConfig';

interface FileItem {
  id: string;
  name: string;
  role: string;
  isExpanded?: boolean;
}

interface DriveApiResponse {
  files: Array<{
    id: string;
    name: string;
  }>;
}

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

const isValidRole = (role: keyof typeof FolderConfig): role is keyof typeof FolderConfig => {
  return role in FolderConfig;
};

const GuidePage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (!user?.roles?.length) {
          throw new Error('Usuario no autenticado o sin roles asignados');
        }

        if (!GOOGLE_API_KEY) {
          throw new Error('API key de Google Drive no configurada. Por favor, contacte al administrador.');
        }

        const validRoles = (user.roles as Array<keyof typeof FolderConfig>).filter(isValidRole);
        const userFolderIds = validRoles.map(role => FolderConfig[role]);

        if (!userFolderIds.length) {
          throw new Error('No hay manuales disponibles para tus roles');
        }

        const allFiles: FileItem[] = [];

        for (const folderId of userFolderIds) {
          try {
            const response = await fetch(
              `https://www.googleapis.com/drive/v3/files?q=\'${folderId}\' in parents&key=${GOOGLE_API_KEY}&fields=files(id,name)`
            );

            if (!response.ok) {
              console.error(`Error al obtener archivos del folder ${folderId}: ${response.status}`);
              continue;
            }

            const data: DriveApiResponse = await response.json();
            const role = Object.entries(FolderConfig).find(
              ([_, id]) => id === folderId
            )?.[0] || 'Desconocido';

            allFiles.push(
              ...data.files.map((file: { id: string; name: string }) => ({
                ...file,
                role
              }))
            );
          } catch (folderError) {
            console.error(`Error al procesar carpeta ${folderId}:`, folderError);
            continue;
          }
        }

        setFiles(allFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar los manuales');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const toggleExpand = (fileId: string) => {
    setSelectedFile(selectedFile === fileId ? null : fileId);
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, isExpanded: !file.isExpanded } : file
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
          <p className="mt-4 text-gray-600 animate-pulse">Cargando manuales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manuales de Usuario
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Accede a todos los manuales y documentación disponibles para tus roles asignados
        </p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 px-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-xl font-semibold text-gray-600">No hay manuales disponibles para tus roles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {files.map((file) => (
            <div
              key={`${file.id}-${file.role}`}
              className={`group bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] 
                ${selectedFile === file.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {file.name}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {file.role}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(file.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={file.isExpanded ? "Contraer" : "Expandir"}
                  >
                    <svg 
                      className={`h-5 w-5 transform transition-transform ${file.isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden
                  ${file.isExpanded ? 'h-[600px] opacity-100' : 'h-[200px] opacity-90'}`}
                >
                  <iframe
                    src={`https://drive.google.com/file/d/${file.id}/preview`}
                    width="100%"
                    height={file.isExpanded ? "600" : "200"}
                    className="rounded-lg border border-gray-200 shadow-inner"
                    title={file.name}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(file.id)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    {file.isExpanded ? (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                        Ver menos
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        Ver más
                      </>
                    )}
                  </button>
                  
                  <a
                    href={`https://drive.google.com/uc?export=download&id=${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                      text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                      shadow-md hover:shadow-lg"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuidePage;