import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: FieldType & { id: string }) =>
      request.patch(`/user/${id}`, data).then((res) => res.data),
  });
};
