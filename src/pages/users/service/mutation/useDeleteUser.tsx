import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../config/request";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id: string) =>
      request.delete(`/user/${id}`).then((res) => res.data),
  });
};
