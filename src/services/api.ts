import axios from "axios";

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

interface LoginData {
  username: string;
  password: string;
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

export const fetchCargos = async () => {
  const response = await api.get("/api/cargos");
  return response.data;
};

export const fetchDependencias = async () => {
  const response = await api.get("/api/dependencias");
  return response.data;
};
