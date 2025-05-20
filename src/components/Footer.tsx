import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import useLocation from '../hooks/useLocation';

const Footer = () => {
  const { location } = useLocation();

  const currentYear = new Date().getFullYear();

  const defaultLocation = {
    address: "Dirección no disponible",
    schedule: "Horario no disponible",
    email: "info@colegio.com",
    phoneNumber: "+506 0000-0000",
  };

  const contactInfo = {
    address: location?.addres || defaultLocation.address,
    schedule: location?.schedule || defaultLocation.schedule,
    email: location?.email || defaultLocation.email,
    phoneNumber: location?.phoneNumber || defaultLocation.phoneNumber,
  };

  return (
    <footer className="bg-darkBlue py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Sección de Información */}
          <div>
            <img
              src="https://i.ibb.co/j978RKxF/CTPmnsn.webp"
              className="mr-5 h-10"
              alt="Logo de la Institución"
            />
            <p className="mt-4 text-sm text-gray-300">
              En el CTP la Mansión trabajamos para ser mejores cada día.
            </p>
            <div className="flex mt-8 space-x-6">
              <a
                className="hover:opacity-75"
                href="https://www.facebook.com/share/18momtuckC/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <FaFacebookF className="w-6 h-6 text-gray-300" />
              </a>
              <a
                className="hover:opacity-75"
                href="https://www.instagram.com/ctplm1976/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <FaInstagram className="w-6 h-6 text-gray-300" />
              </a>
              <a
                className="hover:opacity-75"
                href="https://wa.me/50689894646"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">WhatsApp</span>
                <FaWhatsapp className="w-6 h-6 text-gray-300" />
              </a>
            </div>
          </div>

          {/* Sección de Dirección y Horario */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-gray-200">Nuestra Dirección</h3>
              <p className="mt-4 text-sm text-gray-400">
                {contactInfo.address}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">Horario</h3>
              <p className="mt-4 text-sm text-gray-400">
                {contactInfo.schedule}
              </p>
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg text-gray-200">Contacto</h3>
              <p className="mt-4 text-sm text-gray-400">
                Correo:{" "}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:underline text-gray-300"
                >
                  {contactInfo.email}
                </a>
                <br />
                Teléfono:{" "}
                <a
                  href={`tel:${contactInfo.phoneNumber}`}
                  className="hover:underline text-gray-300"
                >
                  {contactInfo.phoneNumber}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Línea de Separación y Derechos Reservados */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-xs text-gray-400">
          <p>© {currentYear} Colegio Técnico Profesional La Mansión. Casi todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
