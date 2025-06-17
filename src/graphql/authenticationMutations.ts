import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      refresh_token
      access_token
      user {
        business {
          business_name
        }
      }
    }
  }
`;

export const SEARCH_STAFF = gql`
  mutation SearchStaff($query: String!) {
    searchStaff(query: $query) {
      message
      data {
        id
        name
      }
    }
  }
`;

export const STAFF_SIGN_IN = gql`
  mutation StaffLogin(
    $staffLoginId: String!
    $password: String!
    $context: StaffLoginContext!
  ) {
    staffLogin(id: $staffLoginId, password: $password, context: $context) {
      access_token
      refresh_token
      message
      staff {
        id
        business_id
        staff_information {
          personal_information {
            email
            first_name
            last_name
          }
        }
      }
    }
  }
`;

export const STAFF_LOGOUT_MUTATION = gql`
  mutation StaffLogout {
    staffLogout {
      message
    }
  }
`;


