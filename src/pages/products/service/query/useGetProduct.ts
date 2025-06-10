import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => request.get("/products").then((res) => res.data),
  });
};
