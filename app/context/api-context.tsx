'use client'
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ApiQueryClientProviderProps {
  children: ReactNode;
}

// Create a singleton QueryClient instance that can be shared
// This is important for SSR to ensure hydration matches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
    },
  },
});

// Provider component that uses the singleton QueryClient
export const ApiQueryClientProvider: React.FC<ApiQueryClientProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
