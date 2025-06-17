'use client';

import { ApolloProvider as ApolloClientProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apolloClient';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
}
