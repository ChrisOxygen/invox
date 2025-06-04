import { parseUpworkJob } from "@/features/proposals/actions";
import { useMutation } from "@tanstack/react-query";

export const useAnalizeJobDetails = () => {
  const {
    mutate: analizeJobDetails,
    isPending: isAnalizing,
    error: analizeJobDetailsError,
    isSuccess: analizeJobDetailsSuccess,
    data: analizeJobDetailsApiResponse,
  } = useMutation({
    mutationFn: parseUpworkJob,
  });

  return {
    analizeJobDetails,
    isAnalizing,
    analizeJobDetailsError,
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
  };
};
