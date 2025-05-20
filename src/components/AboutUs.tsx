import { Link } from 'react-router-dom';
import { useAboutUsContent } from '../hooks/useAboutUsContent';

const SkeletonAboutUs = () => (
  <div className="relative flex flex-col items-center justify-center bg-white overflow-hidden pt-16 z-10 animate-pulse">
    <div className="container mx-auto px-4 pb-20 md:pb-10">
      <div className="flex flex-col lg:flex-row items-center justify-between py-16 space-y-6 lg:space-y-0">
        {/* Skeleton for text content */}
        <div className="lg:max-w-xl lg:pr-5 space-y-4 w-full">
          <div className="h-4 w-32 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-3/4 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-1/2 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-full bg-gray-300 rounded mt-4"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="mt-10 h-6 w-44 bg-gray-300 rounded-full"></div>
        </div>

        {/* Skeleton for image */}
        <div className="hidden lg:block lg:w-1/2 transform transition duration-500">
          <div className="h-[400px] w-full bg-gray-300 rounded-[3rem] shadow-lg"></div>
        </div>
      </div>
    </div>

    {/* Separador con degradado */}
    <div className="w-full h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 my-10"></div>
  </div>
);

const AboutUs = () => {
  const { content, loading, error } = useAboutUsContent();

  if (loading) return <SkeletonAboutUs />;
  if (error) return <p className="text-red-600 text-center">Error: {error.message}</p>;
  if (!content) return <p className="text-gray-500 text-center">No se encontró contenido.</p>;

  return (
    <div className="relative flex flex-col items-center justify-center bg-white overflow-hidden pt-16 z-10">
      <div className="container mx-auto px-4 pb-20 md:pb-10">
        <div className="flex flex-col lg:flex-row items-center justify-between py-16">
          {/* Contenido textual */}
          <div className="relative z-40 lg:max-w-xl lg:pr-5 space-y-6 animate-fadeIn">
            <p className="text-sm uppercase tracking-wider text-burntOrange">
              {content.title}
            </p>
            <h1 className="mb-6 text-5xl font-light leading-snug tracking-tight text-[#34436B] sm:text-7xl sm:leading-snug">
              ¿Quiénes{' '}
              <span className="inline-block font-bold text-darkBlue bg-gradient-to-r from-[#34436B] to-[#34436B] bg-clip-text text-transparent">
                Somos?
              </span>
            </h1>
            <p className="text-base text-darkBlue leading-relaxed animate-fadeInUp">
              {content.description}
            </p>
            <div className="mt-10">
              <Link
                to="/us"
                aria-label="Conoce más de nosotros"
                className="inline-flex items-center font-semibold text-burntOrange transition-transform group hover:translate-x-1"
              >
                Conoce un poco más de nosotros
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-4 h-6 w-6 text-burntOrange transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Imagen del contenido */}
          {content.url_Image && (
            <div className="relative hidden lg:block lg:w-1/2 transform transition duration-500 hover:scale-105 hover:shadow-lg">
              <div className="overflow-hidden rounded-[3rem] shadow-lg">
                <img
                  src={content.url_Image}
                  alt="Nosotros"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default AboutUs;
