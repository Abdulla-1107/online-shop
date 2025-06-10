import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

interface categoryEditT {
  name: string;
  id?: string;
}

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: (data: categoryEditT) =>
      request
        .patch(`/category/${data.id}`, { name: data.name })
        .then((res) => res.data),
  });
};
