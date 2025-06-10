import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  name: string;
  typeId: string;
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: FieldType) =>
      request.post("/category", data).then((res) => res.data),
  });
};
