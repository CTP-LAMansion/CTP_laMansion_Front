import { useState } from "react";
import { FaFacebookF, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Variantes de animación para el menú móvil
  const menuVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 100 } },
    closed: { x: "100%", transition: { type: "spring", stiffness: 100 } },
  };

  // Variantes de animación para los elementos del menú
  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    closed: { opacity: 0, y: 20 },
  };

  return (
    <div className="w-full min-h-[80px] flex justify-between items-center fixed top-0 z-50 bg-gradient-to-r from-darkBlue to-[#13152A] text-white shadow-md transition duration-300">
      <div className="flex items-center justify-between w-full px-4">
        {/* Logo */}
        <img
          src="https://i.ibb.co/j978RKxF/CTPmnsn.webp"
          alt="Logo"
          className="h-12 w-12 object-cover"
        />

        {/* Menú de escritorio */}
        <ul className="hidden sm:flex space-x-6 ml-auto">
          <li className="relative group">
            <Link
              to="/"
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Inicio
            </Link>
          </li>

          <li className="relative group">
            <Link
              to="/us"
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Nosotros
            </Link>
          </li>

          <li className="relative group">
            <span className="relative pb-1 cursor-pointer transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300">
              Oferta Académica
            </span>
            <ul className="absolute left-0 top-full w-48 bg-white text-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 shadow-lg">
              <li>
                <Link
                  to="/specialities"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Especialidades
                </Link>
              </li>
              <li>
                <Link
                  to="/workshops"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Talleres Exploratorios
                </Link>
              </li>
            </ul>
          </li>

          <li className="relative group">
            <Link
              to="/events"
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Eventos
            </Link>
          </li>

          <li className="relative group">
            <Link
              to="/certificates"
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Solicitud de Certificados
            </Link>
          </li>

          <li className="relative group">
            <a
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
              href="https://sicai.pcpuris.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="SICAI"
            >
              SICAI
            </a>

          </li>

          <li className="relative group">
            <Link
              to="/udps"
              className="relative pb-1 transition-all duration-300 hover:text-teal-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-400 hover:after:w-full after:transition-all after:duration-300"
            >
              UDP's
            </Link>
          </li>
        </ul>

        {/* Iconos de redes sociales y menú hamburguesa */}
        <div className="flex items-center">
          <a
            className="hover:text-teal-400"
            href="https://www.facebook.com/share/18momtuckC/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF className="mx-4" />
          </a>
          {/* Icono de hamburguesa */}
          <div onClick={handleNav} className="sm:hidden z-10 cursor-pointer">
            {nav ? <FaTimes size={20} /> : <FaBars size={20} />}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {nav && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 w-4/5 h-screen bg-gradient-to-b from-darkBlue to-[#13152A] p-4 text-white sm:hidden shadow-2xl"
            role="dialog"
            aria-hidden={!nav}
          >
            <ul className="space-y-6 text-xl mt-10">
              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <Link to="/">Inicio</Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <Link to="/us">Nosotros</Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <span className="cursor-pointer">Oferta Académica</span>
                <ul className="pl-4 mt-2 space-y-2">
                  <motion.li
                    variants={itemVariants}
                    onClick={handleNav}
                    className="p-2 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <Link to="/specialities">Especialidades</Link>
                  </motion.li>
                  <motion.li
                    variants={itemVariants}
                    onClick={handleNav}
                    className="p-2 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <Link to="/workshops">Talleres Exploratorios</Link>
                  </motion.li>
                </ul>
              </motion.li>
              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <Link to="/events">Eventos</Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <Link to="/certificates">Solicitud de Certificados</Link>
              </motion.li>

              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <a href="https://sicai.pcpuris.com/">SICAI</a>
              </motion.li>

              <motion.li
                variants={itemVariants}
                onClick={handleNav}
                className="p-3 rounded-lg hover:bg-teal-400 hover:text-white transition-all duration-300 shadow-md"
              >
                <Link to="/udps">UDP's</Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;