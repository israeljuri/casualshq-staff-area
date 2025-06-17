'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from 'react-hot-toast';
import { AlertProvider } from './AlertProvider';
import { ApolloProvider } from './ApolloProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider>
        <AlertProvider>
          {children}
          <Toaster position="top-center" />
        </AlertProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
