import { apolloClient } from '@/lib/apolloClient';

import {
  SEARCH_STAFF,
  SIGN_IN,
  STAFF_LOGOUT_MUTATION,
  STAFF_SIGN_IN,
} from '@/graphql/authenticationMutations';
import { ApolloError } from '@apollo/client';

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  access_token: string;
  refresh_token: string;
  message: string;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: {
        input: data,
      },
    });

    const access_token = result.data?.login?.access_token;
    const refresh_token = result.data?.login?.refresh_token;

    if (typeof access_token === 'string' && typeof refresh_token === 'string') {
      return {
        success: true,
        access_token,
        refresh_token,
        message: result.data?.login?.message,
      };
    } else {
      console.error(
        'Unexpected response structure from GraphQL server:',
        result
      );
      return {
        success: false,
        access_token: '',
        refresh_token: '',
        message: result.data?.login?.message,
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during sign in:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          access_token: '',
          refresh_token: '',
          message: error.message,
        };
      }

      if (error.networkError) {
        return {
          success: false,
          access_token: '',
          refresh_token: '',
          message: error.message,
        };
      }
    }

    console.error('An unknown error occurred during sign in:', error);

    return {
      success: false,
      access_token: '',
      refresh_token: '',
      message: 'An unknown error occurred',
    };
  }
}

export async function staffSearch(query: string): Promise<{
  success: boolean;
  message: string;
  data: { id: string; name: string }[];
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: SEARCH_STAFF,
      variables: {
        query,
      },
    });

    const message = result.data?.searchStaff?.message;
    const data = result.data?.searchStaff?.data;

    if (typeof message === 'string' && typeof data === 'object') {
      return {
        success: true,
        message,
        data,
      };
    } else {
      console.error(
        'Unexpected response structure from GraphQL server:',
        result
      );
      return {
        success: false,
        message: '',
        data: [],
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff search:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: '',
          data: [],
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: '',
          data: [],
        };
      }
    }

    console.error('An unknown error occurred during staff search:', error);

    return {
      success: false,
      message: '',
      data: [],
    };
  }
}

export async function staffSignIn({
  staffLoginId,
  password,
  context,
}: {
  staffLoginId: string;
  password: string;
  context: string;
}): Promise<{
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  staff: {
    id: string;
    staff_information: {
      personal_information: {
        first_name: string;
        last_name: string;
      };
    };
    timesheets: {
      id: string;
      date: string;
      time_in: string;
      time_out: string;
      break_start: string;
      break_end: string;
      total_break: string;
      total_hours: string;
      status: string;
      overtime: string;
    }[];
  };
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: STAFF_SIGN_IN,
      variables: {
        staffLoginId,
        password,
        context,
      },
    });

    const message = result.data?.staffLogin?.message;

    if (typeof message === 'string') {
      return {
        success: true,
        message,
        access_token: result.data?.staffLogin?.access_token,
        refresh_token: '',
        staff: result.data.staffLogin.staff,
      };
    } else {
      console.error(
        'Unexpected response structure from GraphQL server:',
        result
      );
      return {
        success: false,
        message,
        access_token: '',
        refresh_token: '',
        staff: {
          id: '',
          staff_information: {
            personal_information: {
              first_name: '',
              last_name: '',
            },
          },
          timesheets: [],
        },
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff sign in:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.message,
          access_token: '',
          refresh_token: '',
          staff: {
            id: '',
            staff_information: {
              personal_information: {
                first_name: '',
                last_name: '',
              },
            },
            timesheets: [],
          },
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: error.message,
          access_token: '',
          refresh_token: '',
          staff: {
            id: '',
            staff_information: {
              personal_information: {
                first_name: '',
                last_name: '',
              },
            },
            timesheets: [],
          },
        };
      }
    }

    console.error('An unknown error occurred during staff sign in:', error);

    return {
      success: false,
      message: 'An unknown error',
      access_token: '',
      refresh_token: '',
      staff: {
        id: '',
        staff_information: {
          personal_information: {
            first_name: '',
            last_name: '',
          },
        },
        timesheets: [],
      },
    };
  }
}

export async function staffLogout() {
  try {
    const result = await apolloClient.mutate({
      mutation: STAFF_LOGOUT_MUTATION,
    });

    const message = result.data?.staffLogout?.message;

    if (typeof message === 'string') {
      return {
        success: true,
        message,
      };
    } else {
      console.error(
        'Unexpected response structure from GraphQL server:',
        result
      );
      return {
        success: false,
        message,
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff sign out:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    console.error('An unknown error occurred during staff sign out:', error);

    return {
      success: false,
      message: 'An unknown error',
    };
  }
}
