import { gql } from '@apollo/client';

export const CLOCKOUT = gql`
  mutation ClockOut {
    clockOut {
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

export const CLOCKIN = gql`
  mutation ClockIn {
    clockIn {
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

export const START_BREAK = gql`
  mutation StartBreak($breakTypeId: ID!) {
    startBreak(break_type_id: $breakTypeId) {
      id
      break_start
      break_end
    }
  }
`;

export const END_BREAK = gql`
  mutation EndBreak {
    endBreak {
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
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
