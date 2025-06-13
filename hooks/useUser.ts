"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { _getUser } from "@/actions";
import { AuthResponse } from "@/types";

export function useUser() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const query = useQuery<AuthResponse, Error>({
    queryKey: ["user", session?.user?.id],

    queryFn: async () => {
      const result = await _getUser();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    enabled: status === "authenticated" && !!session?.user?.id,

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    user: query.data?.user || null,
    isLoading: status === "loading" || query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isAuthenticated: status === "authenticated",
    isSuccess:
      query.isSuccess && status === "authenticated" && !!query.data?.user,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
