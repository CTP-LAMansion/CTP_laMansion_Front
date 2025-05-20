import Navbar from './Navbar';
import Footer from './Footer';
import { useEvents } from '../hooks/useEvents';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AOS from 'aos';

const EventsPage = () => {
  const { events, loading, error } = useEvents();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate);

  const sortedEvents = upcomingEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (loading) return <EventsSkeleton />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <section className="text-gray-700 body-font">
        <div className="container mx-auto px-5 py-24">
          <div className="flex justify-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r bg-[#34436B] relative">
              Próximos Eventos
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mx-auto mt-1 rounded-full"></span>
            </h2>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                ¡No hay eventos próximos!
              </h3>
              <p className="text-gray-500">
                En este momento no hay eventos programados. ¡Vuelve pronto para estar al tanto de nuestras próximas actividades!
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-gray-300 pl-6">
              {sortedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="mb-10 ml-6"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <div className="absolute -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {new Date(event.date).toLocaleString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                    <p className="leading-relaxed text-gray-700">
                      {event.description}
                    </p>
                    <div className="mt-4 w-full">
                      <img
                        className="w-full max-h-96 object-contain rounded-lg shadow-md mx-auto"
                        src={event.url_Image}
                        alt={event.title}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EventsPage;

const EventsSkeleton = () => (
  <div className="container mx-auto px-5 py-24 animate-pulse">
    <h2 className="text-3xl font-semibold text-center text-gray-300 mb-12">
      Cargando Eventos...
    </h2>
    <div className="flex flex-wrap -m-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 w-full sm:w-1/2 md:w-1/3">
          <div className="h-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
            <div className="w-full h-40 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
