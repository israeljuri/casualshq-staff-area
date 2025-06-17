import { apolloClient } from '@/lib/apolloClient';
import {
  ONBOARD_STAFF_PERSONAL_INFORMATION,
  ONBOARD_STAFF_ADDRESS,
  ONBOARD_STAFF_EMERGENCY_CONTACT,
  ONBOARD_STAFF_FINANCIAL_INFORMATION,
  ONBOARD_STAFF_PASSWORD_SETUP,
} from '@/graphql/onboardingMutations';
import { ApolloError } from '@apollo/client';

export async function onboardStaffPersonalInformation(input: {
  title: string;
  other_names: string;
  phone_number: string;
  token_id: string;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    address: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
  };
  stage:
    | 'PERSONAL_INFORMATION'
    | 'ADDRESS'
    | 'EMERGENCY_CONTACT'
    | 'FINANCIAL_INFORMATION'
    | 'COMPLETED';
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: ONBOARD_STAFF_PERSONAL_INFORMATION,
      variables: {
        input,
      },
    });

    const message = result.data?.onboardStaffPersonalInformation?.message;
    const data = result.data?.onboardStaffPersonalInformation?.data;

    if (typeof message === 'string' && typeof data === 'object') {
      return {
        success: true,
        message,
        data,
        stage: result.data?.onboardStaffPersonalInformation?.stage,
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
        data: {
          address: '',
          street: '',
          city: '',
          postcode: '',
          country: '',
          state: '',
        },
        stage: 'PERSONAL_INFORMATION',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff personal information:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          data: {
            address: '',
            street: '',
            city: '',
            postcode: '',
            country: '',
            state: '',
          },
          stage: 'PERSONAL_INFORMATION',
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: {
            address: '',
            street: '',
            city: '',
            postcode: '',
            country: '',
            state: '',
          },
          stage: 'PERSONAL_INFORMATION',
        };
      }
    }

    console.error(
      'An unknown error occurred during staff personal information:',
      error
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      data: {
        address: '',
        street: '',
        city: '',
        postcode: '',
        country: '',
        state: '',
      },
      stage: 'PERSONAL_INFORMATION',
    };
  }
}

export async function onboardStaffAddress(input: {
  address: string;
  state: string;
  country: string;
  street: string;
  city: string;
  postcode: number;
  token_id: string;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    relationship: string;
    name: string;
    phone_number: string;
    address: string;
  };
  stage:
    | 'ADDRESS'
    | 'EMERGENCY_CONTACT'
    | 'FINANCIAL_INFORMATION'
    | 'COMPLETED';
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: ONBOARD_STAFF_ADDRESS,
      variables: {
        input,
      },
    });

    const message = result.data?.onboardStaffAddress?.message;

    if (typeof message === 'string') {
      return {
        success: true,
        message,
        data: result.data?.onboardStaffAddress?.data,
        stage: result.data?.onboardStaffAddress?.stage,
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
        data: {
          relationship: '',
          name: '',
          phone_number: '',
          address: '',
        },
        stage: 'ADDRESS',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff address:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          data: {
            relationship: '',
            name: '',
            phone_number: '',
            address: '',
          },
          stage: 'ADDRESS',
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: {
            relationship: '',
            name: '',
            phone_number: '',
            address: '',
          },
          stage: 'ADDRESS',
        };
      }
    }

    console.error('An unknown error occurred during staff address:', error);

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      data: {
        relationship: '',
        name: '',
        phone_number: '',
        address: '',
      },
      stage: 'ADDRESS',
    };
  }
}

export async function onboardStaffEmergencyContact(input: {
  relationship: string;
  name: string;
  phone_number: string;
  address: string;
  token_id: string;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    tax_file_number: string;
    bank_bsb: string;
    account_name: string;
    account_number: string;
    super_fund_name: string;
    fund_abn: string;
    super_fund_usi: string;
    member_number: string;
  };
  stage: 'COMPLETED' | 'EMERGENCY_CONTACT' | 'FINANCIAL_INFORMATION';
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: ONBOARD_STAFF_EMERGENCY_CONTACT,
      variables: {
        input,
      },
    });

    const message = result.data?.onboardStaffEmergencyContact?.message;
    const data = result.data?.onboardStaffEmergencyContact?.data;

    if (typeof message === 'string') {
      return {
        success: true,
        message,
        data,
        stage: result.data?.onboardStaffEmergencyContact?.stage,
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
        data: {
          tax_file_number: '',
          bank_bsb: '',
          account_name: '',
          account_number: '',
          super_fund_name: '',
          fund_abn: '',
          super_fund_usi: '',
          member_number: '',
        },
        stage: 'EMERGENCY_CONTACT',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff emergency contact:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          data: {
            tax_file_number: '',
            bank_bsb: '',
            account_name: '',
            account_number: '',
            super_fund_name: '',
            fund_abn: '',
            super_fund_usi: '',
            member_number: '',
          },
          stage: 'EMERGENCY_CONTACT',
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: {
            tax_file_number: '',
            bank_bsb: '',
            account_name: '',
            account_number: '',
            super_fund_name: '',
            fund_abn: '',
            super_fund_usi: '',
            member_number: '',
          },
          stage: 'EMERGENCY_CONTACT',
        };
      }
    }

    console.error(
      'An unknown error occurred during staff emergency contact:',
      error
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      data: {
        tax_file_number: '',
        bank_bsb: '',
        account_name: '',
        account_number: '',
        super_fund_name: '',
        fund_abn: '',
        super_fund_usi: '',
        member_number: '',
      },
      stage: 'EMERGENCY_CONTACT',
    };
  }
}

export async function onboardStaffFinancialInformation(input: {
  tax_file_number: string;
  bank_bsb: string;
  account_name: string;
  account_number: string;
  super_fund_name: string;
  fund_abn: string;
  super_fund_usi: string;
  member_number: string;
  token_id: string;
}): Promise<{
  success: boolean;
  message: string;
  stage: 'COMPLETED' | 'FINANCIAL_INFORMATION';
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: ONBOARD_STAFF_FINANCIAL_INFORMATION,
      variables: {
        input,
      },
    });

    const message = result.data?.onboardStaffFinancialInformation?.message;

    if (typeof message === 'string') {
      return {
        success: true,
        message,
        stage: result.data?.onboardStaffFinancialInformation?.stage,
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
        stage: 'FINANCIAL_INFORMATION',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff financial information:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          stage: 'FINANCIAL_INFORMATION',
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          stage: 'FINANCIAL_INFORMATION',
        };
      }
    }

    console.error(
      'An unknown error occurred during staff financial information:',
      error
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      stage: 'FINANCIAL_INFORMATION',
    };
  }
}

export async function onboardStaffPassword(input: {
  password: string;
  token_id: string;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    email: string;
    first_name: string;
    last_name: string;
    other_names: string;
    phone_number: string;
    title: string;
  };
  stage:
    | 'PASSWORD_SETUP'
    | 'PERSONAL_INFORMATION'
    | 'ADDRESS'
    | 'EMERGENCY_CONTACT'
    | 'FINANCIAL_INFORMATION'
    | 'COMPLETED';
}> {
  try {
    const result = await apolloClient.mutate({
      mutation: ONBOARD_STAFF_PASSWORD_SETUP,
      variables: {
        input,
      },
    });

    const message = result.data?.onboardStaffPassword?.message;
    const data = result.data?.onboardStaffPassword?.personal_information;

    if (typeof message === 'string' && typeof data === 'object') {
      return {
        success: true,
        message,
        data,
        stage: result.data?.onboardStaffPassword?.stage,
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
        data: {
          email: '',
          first_name: '',
          last_name: '',
          other_names: '',
          phone_number: '',
          title: '',
        },
        stage: 'PASSWORD_SETUP',
      };
    }
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error('ApolloError during staff financial information:', {
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        message: error.message,
      });

      if (error.graphQLErrors.length > 0) {
        return {
          success: false,
          message: error.graphQLErrors[0].message,
          stage: 'PASSWORD_SETUP',
          data: {
            email: '',
            first_name: '',
            last_name: '',
            other_names: '',
            phone_number: '',
            title: '',
          },
        };
      }

      if (error.networkError) {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          stage: 'PASSWORD_SETUP',
          data: {
            email: '',
            first_name: '',
            last_name: '',
            other_names: '',
            phone_number: '',
            title: '',
          },
        };
      }
    }

    console.error(
      'An unknown error occurred during staff emergency contact:',
      error
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      stage: 'PASSWORD_SETUP',
      data: {
        email: '',
        first_name: '',
        last_name: '',
        other_names: '',
        phone_number: '',
        title: '',
      },
    };
  }
}
