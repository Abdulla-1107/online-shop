import { request } from "../../../../config/request";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  id: string;
  name: string;
  price: number;
  count: number;
  description: string;
  categoryId: string;
  colorIds: string[];
  img: string;
  colorId?: string; 
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: FieldType & { id: string }) =>
      request.patch(`/products/${id}`, data).then((res) => res.data),
  });
};