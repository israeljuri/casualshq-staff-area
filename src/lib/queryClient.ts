import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configure default query options here if needed
      // e.g., staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});