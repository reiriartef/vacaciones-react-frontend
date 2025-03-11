import { useState } from "react";
import {
  Home,
  UserRoundSearch,
  Menu,
  Calendar,
  UserCog,
  TreePalm,
  CalendarClock,
} from "lucide-react";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
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
        <li
          className="p-4 hover:bg-indigo-700 flex items-center"
          onClick={() => navigate("/usuarios")}
        >
          <UserCog className="mr-2" />
          {isExpanded && <span>Usuarios</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
