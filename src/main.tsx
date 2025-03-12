import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthScreen from "./pages/AuthScreen";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Calendario from "./components/Calendario";
import Usuarios from "./components/Usuarios";
import Empleados from "./components/Empleados";
import Dependencias from "./components/Dependencias";
import Cargos from "./components/Cargos";
import Vacaciones from "./components/Vacaciones";
import Permisos from "./components/Permisos";
import WelcomePage from "./components/WelcomePage";
import ChangePassword from "./components/ChangePassword";
import ProfileScreen from "./components/Profile";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthScreen />
                </PublicRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<WelcomePage />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/empleados" element={<Empleados />} />
                      <Route path="/vacaciones" element={<Vacaciones />} />
                      <Route path="/feriados" element={<Calendario />} />
                      <Route path="/permisos" element={<Permisos />} />
                      <Route path="/usuarios" element={<Usuarios />} />
                      <Route path="/dependencias" element={<Dependencias />} />
                      <Route path="/cargos" element={<Cargos />} />
                      <Route
                        path="/cambiar_contraseña"
                        element={<ChangePassword />}
                      />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
