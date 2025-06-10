import { request } from "../../../config/request";
import { useMutation } from "@tanstack/react-query";

interface loginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: loginData) =>
      request.post("/auth/login", data).then((res) => res.data),
  });
};
