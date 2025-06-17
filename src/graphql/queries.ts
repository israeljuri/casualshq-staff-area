import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  query RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      access_token
    }
  }
`;

export const GET_BREAK_TYPES = gql`
  query BreakTypes {
    breakTypes {
      id
      name
      duration_minutes
      is_paid
    }
  }
`;

export const GET_TIMESHEETS = gql`
  query Timesheets($filter: TimesheetsFilterInput!) {
    timesheets(filter: $filter) {
      id
      date
      time_in
      time_out
      total_break
      total_hours
      status
      staff_status
      overtime
      break_sessions {
        id
        name
        type {
          id
          name
          duration_minutes
          is_paid
        }
        break_start
        break_end
        duration_minutes
        is_paid
      }
    }
  }
`;

export const GET_USER = gql`
  query StaffMember($staffMemberId: ID!) {
    staffMember(id: $staffMemberId) {
      id
      staff_information {
        personal_information {
          first_name
          last_name
          email
        }
      }
    }
  }
`;

export const GET_BUSINESS = gql`
  query Business {
    business {
      business_name
      business_config {
        work_policies {
          work_hours
          payment_frequency
          payment_period_start_day
        }
      }
    }
  }
`;
