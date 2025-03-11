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
                      <Route path="/" element={<h1>Hola</h1>} />
                      <Route path="/empleados" element={<Empleados />} />
                      <Route path="/feriados" element={<Calendario />} />
                      <Route path="/usuarios" element={<Usuarios />} />
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
