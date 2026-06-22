"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchData,
  postData,
  updateData,
  patchData,
  deleteData,
} from "@/config/apiHelpers";
import { toast } from "sonner";

// Centralized error formatter
const getErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data?.errors && Array.isArray(data.errors)) return data.errors.join(", ");
  if (data?.message) return data.message;
  return error?.message || "Something went wrong. Please try again.";
};

// Helper function to properly handle query keys
const handleQueryKey = (queryKey) => {
  return Array.isArray(queryKey) ? queryKey : [queryKey];
};

// GET - Fetch data
export const useFetchData = (
  endpoint,
  queryKey,
  options = {}
) => {
  return useQuery({
    queryKey: handleQueryKey(queryKey || endpoint),

    queryFn: async ({ signal }) => {
      const res = await fetchData(endpoint, { signal });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch data");
      }

      return res;
    },

    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,

    // Retry logic
    retry: (failureCount, error) => {
      if (error?.name === "CanceledError") return false;
      const status = error?.response?.status;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 3;
    },

    // Exponential backoff
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 5000);
    },

    onError: (error) => {
      if (error?.name === "CanceledError") return;
      toast.error(getErrorMessage(error));
    },
  });
};

// GET - Fetch external data
export const useFetchExternalData = (
  url,
  queryKey,
  options = {}
) => {
  return useQuery({
    queryKey: handleQueryKey(queryKey || url),

    queryFn: async ({ signal }) => {
      const { data } = await axios.get(url, { signal });
      return data;
    },

    refetchInterval: options.refetchInterval ?? 9000,
    staleTime: options.staleTime ?? 9000,
    refetchOnWindowFocus: false,
    enabled: options.enabled ?? true,

    retry: 2,
  });
};

// POST - Create or login
export const usePost = (endpoint, queryKey, isFormData = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const shouldUseFormData =
        isFormData || (typeof FormData !== "undefined" && data instanceof FormData);

      const res = await postData(endpoint, data, shouldUseFormData);

      if (res?.success === false) {
        throw new Error(res.message || "Request failed");
      }

      return res;
    },

    onSuccess: (res) => {
      if (queryKey) {
        queryClient.invalidateQueries({
          queryKey: handleQueryKey(queryKey),
        });
      }

      toast.success(res?.message || "Request successful");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// PUT - Full update
export const usePut = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await updateData(endpoint, data);
      if (!res?.success) throw new Error(res.message || "Update failed");
      return res;
    },
    onSuccess: (res) => {
      if (queryKey) {
        queryClient.invalidateQueries({ 
          queryKey: handleQueryKey(queryKey) 
        });
      }
      toast.success(res?.message || "Updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// PATCH - Partial update
export const usePatch = (endpoint, queryKey, isFormData = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        let url;
        let dataToSend;

        if (payload?.id && payload?.data) {
          url = typeof endpoint === "function" ? endpoint(payload.id) : endpoint;
          dataToSend = payload.data;
        }
        else if (payload?.id) {
          url = typeof endpoint === "function" ? endpoint(payload.id) : endpoint;
          dataToSend = { ...payload };
          delete dataToSend.id;
        }
        else {
          url = endpoint;
          dataToSend = payload;
        }

        const res = await patchData(url, dataToSend, isFormData);

        if (res?.success === false) {
          throw new Error(res.message || "Patch failed");
        }

        return res;
      } catch (error) {
        throw error;
      }
    },

    onSuccess: (res) => {
      if (queryKey) {
        queryClient.invalidateQueries({
          queryKey: handleQueryKey(queryKey),
        });
      }
      toast.success(res?.message || "Updated successfully");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// DELETE - Remove data
export const useDelete = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      if (!id) {
        throw new Error("Missing ID");
      }

      const url = typeof endpoint === "function" ? endpoint(id) : endpoint;
      const res = await deleteData(url);

      if (!res?.success) {
        throw new Error(res.message || "Delete failed");
      }

      return res;
    },
    onSuccess: (res) => {
      if (queryKey) {
        queryClient.invalidateQueries({
          queryKey: handleQueryKey(queryKey),
        });
      }
      toast.success(res?.message || "Deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
