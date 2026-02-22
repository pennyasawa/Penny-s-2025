import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertDeparture } from "@shared/routes";

// GET /api/departures
export function useDepartures() {
  return useQuery({
    queryKey: [api.departures.list.path],
    queryFn: async () => {
      const res = await fetch(api.departures.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch departures");
      return api.departures.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/departures (Sync state or create new if not exists)
export function useSyncDeparture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDeparture) => {
      const res = await fetch(api.departures.sync.path, {
        method: api.departures.sync.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to sync departure");
      return api.departures.sync.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.departures.list.path] });
    },
  });
}

// POST /api/departures/:id/clear
export function useClearDeparture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.departures.clear.path, { id });
      const res = await fetch(url, {
        method: api.departures.clear.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Departure not found");
        throw new Error("Failed to clear departure");
      }
      return api.departures.clear.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.departures.list.path] });
    },
  });
}
