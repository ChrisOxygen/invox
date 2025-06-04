import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch job details from the API
 * @param jobId The ID of the job to fetch
 * @param enabled Whether the query should be enabled
 */
export const useJobDetailsQuery = (jobId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: async () => {
      const response = await fetch(`/api/ex/job-details/${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      return response.json();
    },
    enabled: enabled && !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
