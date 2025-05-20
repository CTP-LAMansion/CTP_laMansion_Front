import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PiMapPinSimpleDuotone } from 'react-icons/pi';
import useLocation from '../hooks/useLocation'; // Ajusta la ruta según sea necesario

const LocationSkeleton = () => (
  <section className="bg-white mt-[60px] z-10">
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
      <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-teal-600 relative inline-block animate-pulse">
          Visítanos
          <span className="block h-1 w-3/4 mx-auto  bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mt-1 rounded-full"></span>
        </h2>
        <p className="mt-4 text-lg text-gray-400 animate-pulse">
          Cargando información de ubicación...
        </p>
      </div>
      <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="h-[480px] bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    </div>
  </section>
);

const LocationSection = () => {
  const { location, loading, error } = useLocation();
  const position: [number, number] = [10.098611822058782, -85.3739927038014];

  if (loading) return <LocationSkeleton />;

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!location) {
    return <div className="text-center text-gray-500">No se encontró la información de la ubicación.</div>;
  }

  return (
    <section className="bg-white mt-[60px] z-10">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#34436B] relative inline-block">
            Visítanos
            <span className="block h-1 w-3/4 mx-auto  bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mt-1 rounded-full"></span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Estamos ubicados en un lugar accesible y estratégico.
          </p>
        </div>
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Mapa con el marcador */}
          <div className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="h-[480px] w-full">
              <MapContainer 
                center={position} 
                zoom={19} 
                scrollWheelZoom={false}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    {location.addres}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="max-w-full mx-auto">
              <div className="px-4 py-9">
                <h3 className="text-xl font-semibold text-[#34436B]">Nuestra Dirección</h3>
                <p className="mt-2 text-gray-600 flex items-center">
                  <PiMapPinSimpleDuotone className="text-teal-500 w-5 h-5 mr-2" />
                  {location.addres}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-6">
                <h3 className="text-xl font-semibold text-[#34436B]">Horario</h3>
                <p className="mt-2 text-gray-600">{location.schedule}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-6">
                <h3 className="text-xl font-semibold text-[#34436B]">Contacto</h3>
                <p className="mt-2 text-gray-600">Email: {location.email}</p>
                <p className="mt-1 text-gray-600">Teléfono: {location.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
