import { apolloClient } from '@/lib/apolloClient';
import { VERIFY_TOKEN } from '@/graphql/onboardingMutations';
import { ApolloError } from '@apollo/client';
import { OnboardingState } from '@/types';

export async function verifyToken(token: string): Promise<{
  success: boolean;
  message: string;
  email: string;
  token_id: string;
  stage: OnboardingState['stage'];
  status: string;
  first_name: string;
  last_name: string;
  other_names: string;
  phone_number: string;
  title: string;
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: VERIFY_TOKEN,
      variables: {
        token,
      },
    });

    const message = result.data?.verifyStaffToken?.message;
    const email = result.data?.verifyStaffToken?.email;

    if (typeof message === 'string' && typeof email === 'string') {
      return {
        success: true,
        message,
        email,
        token_id: result.data?.verifyStaffToken?.token_id,
        stage: result.data?.verifyStaffToken?.stage,
        status: result.data?.verifyStaffToken?.status,
        first_name: result.data?.verifyStaffToken?.first_name,
        last_name: result.data?.verifyStaffToken?.last_name,
        other_names: result.data?.verifyStaffToken?.other_names,
        phone_number: result.data?.verifyStaffToken?.phone_number,
        title: result.data?.verifyStaffToken?.title,
      };
    } else {
      console.error(
        'Unexpected response structure from GraphQL server:',
        result
      );
      return {
        success: false,
        message:
          'Received an invalid response from the server. Please try again.',
        email: '',
        token_id: '',
        stage: 'EMAIL_VERIFICATION',
        status: '',
        first_name: '',
        last_name: '',
        other_names: '',
        phone_number: '',
        title: '',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff list:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          email: '',
          token_id: '',
          stage: 'EMAIL_VERIFICATION',
          status: '',
          first_name: '',
          last_name: '',
          other_names: '',
          phone_number: '',
          title: '',
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          email: '',
          token_id: '',
          stage: 'EMAIL_VERIFICATION',
          status: '',
          first_name: '',
          last_name: '',
          other_names: '',
          phone_number: '',
          title: '',
        };
      }
    }

    console.error(
      'An unknown error occurred during staff token verification:',
      error
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      email: '',
      token_id: '',
      stage: 'EMAIL_VERIFICATION',
      status: '',
      first_name: '',
      last_name: '',
      other_names: '',
      phone_number: '',
      title: '',
    };
  }
}
