import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type FoldersQuery = z.infer<typeof api.folders.list.input>;
type CreateFolderInput = z.infer<typeof api.folders.create.input>;

export function useFolders(params?: FoldersQuery) {
  return useQuery({
    queryKey: [api.folders.list.path, params],
    queryFn: async () => {
      const url = new URL(api.folders.list.path, window.location.origin);
      if (params?.parentId) {
        url.searchParams.append("parentId", params.parentId);
      }
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch folders");
      
      const data = await res.json();
      const parsed = api.folders.list.responses[200].safeParse(data);
      if (!parsed.success) {
        console.error("Zod parse error folders:", parsed.error);
        throw new Error("Invalid response format");
      }
      return parsed.data;
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateFolderInput) => {
      const res = await fetch(api.folders.create.path, {
        method: api.folders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create folder");
      return api.folders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.folders.list.path] });
      toast({ title: "Folder created" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create folder", description: err.message, variant: "destructive" });
    }
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.folders.delete.path, { id });
      const res = await fetch(url, {
        method: api.folders.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete folder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.folders.list.path] });
      toast({ title: "Folder deleted" });
    },
  });
}
