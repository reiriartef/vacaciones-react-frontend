import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthContextType {
  auth: { token: string | null };
  isAuthenticated: boolean;
  setAuth: React.Dispatch<React.SetStateAction<{ token: string | null }>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  auth: { token: null },
  isAuthenticated: false,
  setAuth: () => {},
  logout: () => {},
});

const isTokenValid = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<{ token: string | null }>({ token: null });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? isTokenValid(token) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      setAuth({ token });
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !isTokenValid(token)) {
        logout();
      }
    }, 30000); // Verifica cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration > 0) {
        const fiveMinutesBeforeExpiration = timeUntilExpiration - 5 * 60 * 1000;
        const thirtySecondsBeforeExpiration = timeUntilExpiration - 30 * 1000;

        const fiveMinutesTimeout = setTimeout(() => {
          toast.error("Tu sesión expirará en menos de 5 minutos.");
        }, fiveMinutesBeforeExpiration);

        const thirtySecondsTimeout = setTimeout(() => {
          let countdown = 30;
          const countdownInterval = setInterval(() => {
            if (countdown > 0) {
              toast.error(
                `Tu sesión expirará en ${countdown} segundos.
                Vuelve a iniciar sesión para continuar trabajando sin problemas.`,
                {
                  autoClose: 1000,
                }
              );
              countdown -= 1;
            } else {
              clearInterval(countdownInterval);
              logout();
            }
          }, 1000);
        }, thirtySecondsBeforeExpiration);

        return () => {
          clearTimeout(fiveMinutesTimeout);
          clearTimeout(thirtySecondsTimeout);
        };
      }
    }
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null });
    setIsAuthenticated(false);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, setAuth, logout }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
