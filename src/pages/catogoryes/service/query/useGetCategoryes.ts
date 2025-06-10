import { request } from "../../../../config/request";
import { useQuery } from "@tanstack/react-query";
import type { categoryList } from "../../types";

export const useGetCategoryes = () => {
  return useQuery({
    queryKey: ["categoryes"],
    queryFn: () => request.get<categoryList>("/category").then((res) => res.data),
  });
};
