import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define el tipo para nuestro contexto
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Creamos el contexto con el valor inicial en `false`
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Creamos un hook para usar el contexto más fácilmente en otros componentes
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

// Creamos el ThemeProvider que envolverá a los componentes de la app
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verificamos si hay una preferencia guardada en LocalStorage
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Guardamos la preferencia
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
