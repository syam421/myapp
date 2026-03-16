import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      
      const data = await res.json();
      const parsed = api.stats.get.responses[200].safeParse(data);
      if (!parsed.success) {
        console.error("Zod parse error stats:", parsed.error);
        throw new Error("Invalid response format");
      }
      return parsed.data;
    },
  });
}
