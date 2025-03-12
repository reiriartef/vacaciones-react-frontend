import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../services/api";

const ProfileScreen = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({ queryKey: ["userData"], queryFn: getUserData });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos del usuario</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-semibold text-gray-900">
          Información del Usuario
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Detalles personales y de la aplicación.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mt-4">
          Datos Personales
        </h4>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Nombre Completo
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.primer_nombre}{" "}
              {userData.funcionarioDetails.segundo_nombre}{" "}
              {userData.funcionarioDetails.primer_apellido}{" "}
              {userData.funcionarioDetails.segundo_apellido}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Cédula</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.cedula}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Nombre de Usuario
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.nombre_usuario}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Estado</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.estado}
            </dd>
          </div>
        </dl>
        <h4 className="text-md font-semibold text-gray-900 mt-4">
          Datos Laborales
        </h4>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Cargo</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.cargo.nombre}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Dependencia</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.dependencia.nombre}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Fecha de Ingreso
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.fecha_ingreso}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Tipo de Empleado
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.funcionarioDetails.cargo.tipoEmpleado.descripcion}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileScreen;
