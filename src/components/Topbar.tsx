import { useState, useEffect, useRef } from "react";
import { LogOut, User, FileChartLine } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { auth, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRouteName = (pathname: string) => {
    switch (pathname) {
      case "/empleados":
        return "Empleados";
      case "/vacaciones":
        return "Vacaciones";
      case "/permisos":
        return "Permisos";
      case "/feriados":
        return "Feriados";
      case "/usuarios":
        return "Usuarios";
      case "/profile":
        return "Perfil de Usuario";

      default:
        return "Inicio";
    }
  };

  const getUserName = () => {
    if (auth.token) {
      const decoded: any = jwtDecode(auth.token);
      return decoded.nombre + " " + decoded.apellido || "Usuario";
    }
    return "Usuario";
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{getRouteName(location.pathname)}</h1>
      <div className="relative flex items-center space-x-4">
        <span className="text-gray-700 font-medium">{getUserName()}</span>
        <div
          className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer shadow-md"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User className="w-6 h-6 text-gray-700" />
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 mt-2 w-48 bg-white border rounded shadow-lg"
            >
              <ul>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={handleProfileClick}
                >
                  <FileChartLine className="mr-2" />
                  Perfil
                </li>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2" />
                  Cerrar sesión
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
