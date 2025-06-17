import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
  // ApolloLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { getCookie, setCookie } from 'cookies-next';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { useEffect, useState } from 'react';
import { Observable } from '@apollo/client';
import { REFRESH_TOKEN } from '@/graphql/queries';

// --- 1. Global Singleton ---
let apolloClientInstance: ApolloClient<NormalizedCacheObject> | undefined;

// --- 2. Token Refresh Logic ---
async function refreshAdminToken(): Promise<string | null> {
  const refreshToken = getCookie('admin_refresh_token');
  if (!refreshToken) return null;

  try {
    const client = getApolloClient();
    const { data } = await client.query({
      query: REFRESH_TOKEN,
      variables: {
        input: {
          refresh_token: refreshToken,
        },
      },
      fetchPolicy: 'no-cache',
    });

    const newAccessToken = data?.refreshToken?.access_token;
    if (newAccessToken) {
      setCookie('admin_token', newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('Error refreshing admin token:', error);
    return null;
  }
}

// --- 3. Apollo Link Setup ---
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
});

const authLink = setContext((operation, { headers }) => {
  let token = null;
  if (
    operation.operationName === 'StaffLogin' ||
    operation.operationName === 'User' ||
    operation.operationName === 'BreakTypes' ||
    operation.operationName === 'Timesheets' ||
    operation.operationName === 'Business'
  ) {
    token = getCookie('tr-admin_token');
  } else {
    token = getCookie('tr-token');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === 'UNAUTHENTICATED' &&
        operation.operationName === 'User'
      ) {
        return new Observable((observer) => {
          refreshAdminToken().then((newToken) => {
            if (!newToken) {
              observer.error(err);
              return;
            }

            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${newToken}`,
              },
            }));

            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          });
        });
      }
    }
  }
});

// --- 4. Create Apollo Client ---
const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-first' },
      query: { fetchPolicy: 'cache-first' },
      mutate: { fetchPolicy: 'network-only' },
    },
  });
};

// --- 5. Persistent Client Hook ---
export const usePersistentApollo = ():
  | ApolloClient<NormalizedCacheObject>
  | undefined => {
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(apolloClientInstance);

  useEffect(() => {
    async function initApollo() {
      if (apolloClientInstance) {
        setClient(apolloClientInstance);
        return;
      }

      const newClient = createApolloClient();
      await persistCache({
        cache: newClient.cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });

      apolloClientInstance = newClient;
      setClient(newClient);
    }

    if (!apolloClientInstance) {
      initApollo();
    }
  }, []);

  return client;
};

// --- 6. Singleton Getter ---
export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  if (!apolloClientInstance) {
    apolloClientInstance = createApolloClient();
  }
  return apolloClientInstance;
}

export const apolloClient = getApolloClient();
