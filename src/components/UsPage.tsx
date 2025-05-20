import { useEffect } from 'react';
import { FaHandshake, FaHandsHelping, FaLightbulb, FaHeart, FaBalanceScale } from 'react-icons/fa';
import { RiEmpathizeFill } from 'react-icons/ri';
import Navbar from './Navbar';
import Footer from './Footer';
import useUsPage from '../hooks/useUsePage';

const iconMapper: Record<string, JSX.Element> = {
  'Compromiso con la excelencia educativa': <FaLightbulb className="text-burntOrange w-12 h-12" />,
  'Inclusión y respeto a la diversidad': <FaHeart className="text-burntOrange w-12 h-12" />,
  'Responsabilidad y honestidad': <FaBalanceScale className="text-burntOrange w-12 h-12" />,
  'Solidaridad y cooperación': <FaHandsHelping className="text-burntOrange w-12 h-12" />,
  'Respeto y tolerancia': <FaHandshake className="text-burntOrange w-12 h-12" />,
  'Innovación y creatividad': <RiEmpathizeFill className="text-burntOrange w-12 h-12" />
};

const himno = {
  title: '"HIMNO CTP LA MANSIÓN"',
  lyrics: [
    "La Mansión tiene historia grandiosa",
    "pues hay manes patricios aquí",
    "este humilde rincón de la pampa",
    "vio a Crombeth, a Maceo y a Martí.",
    "",
    "El ideal redentor del caribe",
    "se encubó en esta bella Mansión",
    "y en la historia de América Libre",
    "el apóstol Martí es un bastón.",
    "",
    "Compañeros honremos fervientes",
    "a este centro con gran devoción",
    "y el futuro verá en nuestro esfuerzo",
    "a hombres dignos para la nación.",
    "",
    "Que la pampa tremole en sus hijos",
    "a la par del heroico Nambí",
    "y en el alma de cada estudiante",
    "sea un ejemplo el apóstol Martí.",
    "",
    "Música y letra: José Ramírez Saizar",
  ],
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-8">
    <div className="bg-gray-300 h-6 w-1/3 mx-auto rounded"></div>
    <div className="bg-gray-300 h-4 w-2/3 mx-auto rounded"></div>
    <div className="bg-gray-300 h-52 w-full mx-auto rounded mt-4"></div>
  </div>
);

const UsPage = () => {
  const { mission, vision, values, error, loading } = useUsPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center text-red-500 mt-10">{error}</p>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Misión y Visión */}
      <div className="text-center p-8 mt-8">
        {loading && <SkeletonLoader />}
        {!loading && vision && (
          <div className="flex flex-wrap items-center mt-20 text-center">
            <div className="w-full md:w-3/5 lg:w-1/2 px-4">
              <img
                src={vision.url_Image}
                alt="Visión"
                className="inline-block rounded"
                loading="lazy"
              />
            </div>
            <div className="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
              <h2 className="font-bold mt-8 text-xl md:mt-0 sm:text-4xl text-center">
                {vision.title}
              </h2>
              <p className="sm:text-lg mt-6 text-gray-600 text-justify">
                {vision.description}
              </p>
            </div>
          </div>
        )}

        {!loading && mission && (
          <div className="flex flex-wrap items-center mt-20 text-center">
            <div className="w-full md:w-3/5 lg:w-1/2 px-4">
              <img
                src={mission.url_Image}
                alt="Misión"
                className="inline-block rounded"
                loading="lazy"
              />
            </div>
            <div className="w-full md:w-2/5 lg:w-1/2 px-4 md:order-first text-center md:text-left lg:pr-12">
              <h2 className="font-bold mt-8 text-xl md:mt-0 sm:text-4xl text-center">
                {mission.title}
              </h2>
              <p className="sm:text-lg mt-6 text-gray-600 text-justify">
                {mission.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Valores */}
      <section className="bg-gray-100 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.id}
              className="bg-white p-8 shadow-lg rounded-xl flex flex-col justify-between h-64 text-center  items-center"
            >
              <div className="mb-4">{iconMapper[value.title] || <RiEmpathizeFill className="text-burntOrange w-14 h-14 " />}</div>
              <h3 className="text-xl font-bold text-gray-800">{value.title}</h3>
              <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Croquis de la Institución */}
      <div className="text-center p-8">
        <h2 className="font-bold text-xl sm:text-4xl text-center">Croquis de la Institución</h2>
        <div className="flex justify-center mt-6">
          <img
            src="https://i.ibb.co/Q7BHKCPz/Croquis.jpg"
            alt="Croquis de la Institución"
            className="w-full max-w-4xl rounded shadow-lg"
            loading="lazy"
          />
        </div>
      </div>

      {/* Himno */}
      <div className="text-center p-8">
        <h2 className="font-bold text-xl sm:text-4xl text-center">{himno.title}</h2>
        <p className="sm:text-lg mt-6 text-gray-600 text-center whitespace-pre-line italic">
          {himno.lyrics.join("\n")}
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default UsPage;
