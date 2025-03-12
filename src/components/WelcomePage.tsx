const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <img
        src="/darzulia.png"
        alt="Logo DAR Zulia"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-4xl font-bold mb-4">
        Bienvenido al Sistema de Gestión de Vacaciones y Permisos
      </h1>
      <p className="text-lg mb-8 text-center">
        Este sistema te permite gestionar las vacaciones y permisos de los
        empleados de manera eficiente.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold mb-4">
          Instrucciones de Uso
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Empleados:</strong> En esta sección puedes agregar,
            modificar y visualizar la información de los empleados.
          </li>
          <li>
            <strong>Vacaciones:</strong> Aquí puedes gestionar las vacaciones de
            los empleados, incluyendo la aprobación y el disfrute de las mismas.
          </li>
          <li>
            <strong>Permisos:</strong> En esta sección puedes gestionar los
            permisos de los empleados, incluyendo la creación y visualización de
            los mismos.
          </li>
          <li>
            <strong>Feriados:</strong> Aquí puedes agregar y visualizar los días
            feriados, los cuales se tendrán en cuenta al gestionar las
            vacaciones y permisos.
          </li>
          <li>
            <strong>Usuarios:</strong> En esta sección puedes gestionar los
            usuarios del sistema, incluyendo la creación de nuevos usuarios.
          </li>
          <li>
            <strong>Dependencias:</strong> Aquí puedes gestionar las
            dependencias de la organización.
          </li>
          <li>
            <strong>Cargos:</strong> En esta sección puedes gestionar los cargos
            de los empleados.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomePage;
