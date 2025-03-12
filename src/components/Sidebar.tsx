import { useState, useEffect } from "react";
import {
  Home,
  UserRoundSearch,
  Menu,
  Calendar,
  UserCog,
  TreePalm,
  CalendarClock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: { isAdmin: boolean } = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, [isAdmin]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div
      className={`h-full bg-indigo-800 text-white ${
        isExpanded ? "w-70" : "w-15"
      } transition-width duration-300`}
    >
      <div className="p-4 flex justify-between items-center">
        <img
          src="/darzulia.png"
          alt="Logo DAR Zulia"
          className={`ml-6 mt-8 w-46 h-46 ${!isExpanded && "hidden"}`}
        />
        <button onClick={toggleSidebar} className="focus:outline-none">
          <Menu className="text-white" />
        </button>
      </div>
      <ul className="mt-2">
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2" />
          {isExpanded && <span>Inicio</span>}
        </li>
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/empleados")}
        >
          <UserRoundSearch className="mr-2" />
          {isExpanded && <span>Empleados</span>}
        </li>
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/vacaciones")}
        >
          <TreePalm className="mr-2" />
          {isExpanded && <span>Vacaciones</span>}
        </li>
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/permisos")}
        >
          <CalendarClock className="mr-2" />
          {isExpanded && <span>Permisos</span>}
        </li>
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/feriados")}
        >
          <Calendar className="mr-2" />
          {isExpanded && <span>Feriados</span>}
        </li>
        {isAdmin && (
          <li className="p-4 hover:bg-indigo-700 flex items-center flex-col">
            <div
              className="flex items-center justify-between w-full"
              onClick={toggleUserMenu}
            >
              <div className="flex items-center">
                <UserCog className="mr-2" />
                {isExpanded && <span>Administración</span>}
              </div>
              {isExpanded && (
                <button className="focus:outline-none">
                  {isUserMenuOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              )}
            </div>
            {isUserMenuOpen && isExpanded && (
              <ul className="w-full mt-2">
                <li
                  className="p-4 hover:bg-indigo-700 flex items-center"
                  onClick={() => navigate("/usuarios")}
                >
                  <span>Gestión de Usuarios</span>
                </li>
                <li
                  className="p-4 hover:bg-indigo-700 flex items-center"
                  onClick={() => navigate("/dependencias")}
                >
                  <span>Gestión de Dependencias</span>
                </li>
                <li
                  className="p-4 hover:bg-indigo-700 flex items-center"
                  onClick={() => navigate("/cargos")}
                >
                  <span>Gestión de Cargos</span>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
