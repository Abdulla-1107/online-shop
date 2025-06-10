import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";
import type { categoryList, typesList } from "../../types";

export const useGetTypes = () => {
  return useQuery({
    queryKey: ["types"],
    queryFn: () => request.get<typesList[]>("/type").then((res) => res.data),
  });
};
