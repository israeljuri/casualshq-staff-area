import { gql } from '@apollo/client';

export const VERIFY_TOKEN = gql`
  mutation VerifyStaffToken($token: String!) {
    verifyStaffToken(token: $token) {
      message
      token_id
      status
      stage
      email
      first_name
      last_name
      other_names
      phone_number
      title
    }
  }
`;

export const ONBOARD_STAFF_PASSWORD_SETUP = gql`
  mutation OnboardStaffPassword($input: OnboardStaffPasswordInput!) {
    onboardStaffPassword(input: $input) {
      message
      personal_information {
        email
        first_name
        last_name
        other_names
        phone_number
        title
      },
      stage
    }
  }
`;

export const ONBOARD_STAFF_PERSONAL_INFORMATION = gql`
  mutation OnboardStaffPersonalInformation($input: PersonalInformationInput!) {
    onboardStaffPersonalInformation(input: $input) {
      message
      data {
        address
        street
        city
        postcode
        country
        state
      }
      stage
    }
  }
`;

export const ONBOARD_STAFF_ADDRESS = gql`
  mutation OnboardStaffAddress($input: AddressInput!) {
    onboardStaffAddress(input: $input) {
      message
      data {
        relationship
        name
        phone_number
        address
      }
      stage
    }
  }
`;

export const ONBOARD_STAFF_EMERGENCY_CONTACT = gql`
  mutation OnboardStaffEmergencyContact($input: EmergencyContactInput!) {
    onboardStaffEmergencyContact(input: $input) {
      message
      data {
        tax_file_number
        bank_bsb
        account_name
        account_number
        super_fund_name
        fund_abn
        super_fund_usi
        member_number
      }
      stage
    }
  }
`;

export const ONBOARD_STAFF_FINANCIAL_INFORMATION = gql`
  mutation OnboardStaffFinancialInformation(
    $input: FinancialInformationInput!
  ) {
    onboardStaffFinancialInformation(input: $input) {
      message
      stage
    }
  }
`;
