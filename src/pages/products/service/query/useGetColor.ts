import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../config/request";

interface Color {
  id: string;
  name: string;
}

export const useGetColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await request.get<{ data: Color[] }>("/color");
      console.log("useGetColors response:", res.data); 
      return res.data.data; 
    },
  });
};
