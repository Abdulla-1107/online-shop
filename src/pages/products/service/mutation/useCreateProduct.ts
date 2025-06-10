import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  name: string;
  price: number;
  count: number;
  description: string;
  categoryId: string;
  colorId: string; 
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: FieldType) =>
      request.post("/products", data).then((res) => res.data),
  });
};