 import { z } from "zod";

// Sign in Schema
export const SearchStaffSchema = z.object({
  name: z.string().min(1).max(500),
  password: z.string().min(8),
});

// Onboarding Schema
export const CreatePasswordSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Dashboard Schema
export const AccountSetupSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  otherName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  homeAddress: z.object({
    line: z.string(),
    streetName: z.string(),
    city: z.string(),
    postcode: z.string(),
  }),
  emergencyContactInformation: z.object({
    relationship: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
  }),
  tfn: z.string(),
  bankDetails: z.object({
    name: z.string(),
    bsb: z.string(),
    account: z.string(),
  }),
  superAnnuation: z.object({
    name: z.string(),
    abn: z.string(),
    phoneNumber: z.string(),
    usi: z.string(),
    memberNumber: z.string(),
  }),
});

export const PersonalInformationSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  otherName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  homeAddress: z.object({
    line: z.string(),
    streetName: z.string(),
    city: z.string(),
    postcode: z.string(),
  }),
  emergencyContactInformation: z.object({
    relationship: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
  }),
});

export const FinancialInformationSchema = z.object({
  tfn: z.string(),
  bankDetails: z.object({
    name: z.string(),
    bsb: z.string(),
    account: z.string(),
  }),
  superAnnuation: z.object({
    name: z.string(),
    abn: z.string(),
    usi: z.string(),
    memberNumber: z.string(),
  }),
});

export const CockoutReasonSchema = z.object({
  reason: z.string().min(10),
});

// Types
export type CockoutReasonData = z.infer<typeof CockoutReasonSchema>;
export type AccountSetupData = z.infer<typeof AccountSetupSchema>;
export type SearchStaffData = z.infer<typeof SearchStaffSchema>;
export type CreatePasswordData = z.infer<typeof CreatePasswordSchema>;
export type PersonalInformationData = z.infer<typeof PersonalInformationSchema>;
export type FinancialInformationData = z.infer<
  typeof FinancialInformationSchema
>;

export type AccountData = {
  email: string;
  firstName: string;
  lastName: string;
};

export interface OnboardingState {
  currentStep: number;
  password: string | null;
  account: AccountData | null;
  personalInformation: PersonalInformationData | null;
  financialInformation: FinancialInformationData | null;
  setAccount: (account: AccountData) => void;
  setPassword: (password: string) => void;
  setPersonalInformationData: (data: PersonalInformationData) => void;
  setFinancialInformationData: (data: FinancialInformationData) => void;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetOnboarding: () => void;
}

export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  timeLogs: TimeLog[];
  targetDailyHours: number; // hours
  targetWeeklyHours: number; // hours
  targetBreakPerDayMinutes: number;
  breakTypes: BreakType[];
};

export type BreakType = 'Recess' | 'Coffee break' | 'Long break';

export interface BreakRecord {
  id: string;
  startTime: string; // ISO Date string
  endTime?: string | null; // ISO Date string, null if ongoing
  type: BreakType;
  durationMs?: number; // Calculated dynamically or stored if break ended
}

export interface TimeLog {
  id: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // ISO Date string
  clockOutTime?: string | null; // ISO Date string, null if ongoing
  breaks: BreakRecord[];
  totalWorkMs?: number; // Calculated
  totalBreakMs?: number; // Calculated
}

// For active session state in the hook
export interface ActiveSessionState {
  isActive: boolean; // Is user currently clocked in for the selected (today's) date
  isOnBreak: boolean;
  currentWorkSegmentStart: Date | null; // When the current work period (after clock-in or resuming from break) started
  currentBreakRecord: BreakRecord | null; // Details of the current ongoing break
  todaysLog: TimeLog | null; // The log entry for today, being actively built
}
