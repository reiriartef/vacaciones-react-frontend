import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:3000", // Reemplaza con la URL de tu backend
});

// Interceptor para agregar el token de autorización a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token de localStorage o de donde lo estés almacenando
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface NewEmployee {
  cedula: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  id_dependencia: number;
  id_cargo: number;
  fecha_ingreso: string;
  fecha_prima: string;
}

interface UpdateEmployee extends NewEmployee {
  id: number;
}

interface NewVacacion {
  cedula: number;
  fecha_salida: string;
  año: number;
}

interface NewPermiso {
  fecha_permiso: string;
  motivo: string;
  funcionario: number;
  observaciones: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface ChangePasswordData {
  newPassword: string;
}

export const loginUser = async (loginData: LoginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const fetchFeriados = async () => {
  const response = await api.get("/api/feriados");
  return response.data;
};

export const addFeriado = async (data: { fecha: string; titulo: string }) => {
  const response = await api.post("/api/feriados", data);
  return response.data;
};

export const fetchEmployees = async () => {
  const response = await api.get("/api/funcionarios");
  return response.data;
};

export const generateUser = async (data: { cedula: number }) => {
  const response = await api.post("/api/usuarios", {
    funcionario: data.cedula,
  });
  return response.data;
};

export const registerEmployee = async (
  employee: NewEmployee
): Promise<void> => {
  const response = await api.post("/api/funcionarios", employee);
  return response.data;
};

export const updateEmployee = async (employee: UpdateEmployee) => {
  const response = await api.put(`/api/funcionarios/${employee.id}`, employee);
  return response.data;
};

export const fetchCargos = async () => {
  const response = await api.get("/api/cargos");
  return response.data;
};

export const fetchDependencias = async () => {
  const response = await api.get("/api/dependencias");
  return response.data;
};

export const registerDependencia = async (data: { nombre: string }) => {
  const response = await api.post("/api/dependencias", data);
  return response.data;
};

export const registerCargo = async (data: {
  nombre: string;
  tipo_empleado: number;
}) => {
  const response = await api.post("/api/cargos", data);
  return response.data;
};

export const fetchVacaciones = async () => {
  const response = await api.get("/api/vacaciones");
  return response.data;
};

export const registerVacacion = async (data: NewVacacion) => {
  const response = await api.post("/api/vacaciones", data);
  return response.data;
};

export const updateVacation = async (data: { id: number }) => {
  const response = await api.put(`/api/vacaciones/${data.id}`);
  return response.data;
};

export const fetchPermisos = async () => {
  const response = await api.get("/api/permisos");
  return response.data;
};

export const generatePermiso = async (data: NewPermiso) => {
  const response = await api.post("/api/permisos", data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await api.put("/api/usuarios", data);
  return response.data;
};

export const getUserData = async () => {
  const decoded = jwtDecode(localStorage.getItem("token"));
  const userId = decoded.id;
  const response = await api.get(`/api/usuarios/${userId}`);
  return response.data;
};

export const downloadVacationApprovalReport = async (vacationId: number) => {
  const response = await api.get(
    `/api/reportes/aprobacion-vacaciones/${vacationId}`,
    {
      responseType: "blob",
    }
  );
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `aprobacion-vacaciones-${vacationId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
