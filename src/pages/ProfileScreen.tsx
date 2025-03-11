import React from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProfileScreen = () => {
  const { auth } = useAuth();

  const getUserData = () => {
    if (auth.token) {
      const decoded: any = jwtDecode(auth.token);
      return decoded.employee;
    }
    return null;
  };

  const userData = getUserData();

  if (!userData) {
    return <div>Loading...</div>;
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
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Nombre Completo
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.firstName} {userData.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">
              Correo Electrónico
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Puesto</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.position}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Departamento</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.department}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Acerca de</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.about || "No hay información adicional disponible."}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileScreen;
