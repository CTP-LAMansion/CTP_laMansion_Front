import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
import AppRouter from './routers/AppRoter';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> 
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
