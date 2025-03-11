import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/api";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (loginData: any) => loginUser(loginData),
    onError: (error) => {
      console.error("Error al iniciar sesion", error);
    },
  });
};
