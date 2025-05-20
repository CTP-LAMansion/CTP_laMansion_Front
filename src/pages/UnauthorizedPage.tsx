

const Unauthorized: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">No Autorizado</h1>
        <p className="mt-4">No tienes permiso para acceder a esta página.</p>
        <p>Contacta con el administrador si necesitas acceso.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
