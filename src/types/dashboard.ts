// -------- Enums - start

export enum BusinessStatus {
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    VERIFIED = 'VERIFIED',
    ACTIVE = 'ACTIVE',
  }
  
  export enum WageOptions {
    MANUAL = 'MANUAL',
    TEAM = 'TEAM',
    AWARD_RATE = 'AWARD_RATE',
  }
  
  export enum PaymentFrequency {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    BIWEEKLY = 'BIWEEKLY',
  }
  
  export enum PeriodStartDay {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
  }
  
  export enum StaffStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    VERIFIED = 'VERIFIED',
  }
  
  export enum StaffTimesheetStatus {
    CLOCKED_IN = 'CLOCKED_IN',
    CLOCKED_OUT = 'CLOCKED_OUT',
    ON_BREAK = 'ON_BREAK',
  }
  
  export enum TimesheetsScope {
    BUSINESS = 'BUSINESS',
    STAFF = 'STAFF',
  }
  
  export enum TimeSheetStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }
  
  export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
  }
  
  export enum UserStatus {
    PENDING_SETUP = 'PENDING_SETUP',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
  }
  
  export enum StaffLoginContext {
    WEB = 'WEB',
    MOBILE = 'MOBILE',
  }
  
  export enum AuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
  }
  
  // -------- Enums - end
  
  // -------- Breaks - start
  
  export type BreakType = {
    id: string;
    name: string;
    duration_minutes: string;
    is_paid: boolean;
  };
  
  export type BreakSession = {
    id: string;
    name: string;
    type: BreakType;
    break_start: string;
    break_end?: string;
    duration_minutes?: string;
    is_paid: boolean;
  };
  
  export type BreakSessionInput = {
    id?: string;
    name: string;
    duration_minutes: string;
    is_paid: boolean;
  };
  
  // -------- Breaks - end
  
  // -------- Address & Contact - start
  
  export type Address = {
    address: string;
    street: string;
    city: string;
    postcode: number;
    country: string;
    state: string;
  };
  
  export type EmergencyContact = {
    relationship: string;
    name: string;
    phone_number: string;
    address: string;
  };
  
  // -------- Address & Contact - end
  
  // -------- Financial - start
  
  export type FinancialInformation = {
    tax_file_number: string;
    bank_bsb: string;
    account_name: string;
    account_number: string;
    super_fund_name?: string;
    fund_abn?: string;
    super_fund_usi: string;
    member_number?: string;
  };
  
  // -------- Financial - end
  
  // -------- Personal Info - start
  
  export type PersonalInformation = {
    email: string;
    first_name: string;
    last_name: string;
    other_names?: string;
    phone_number: string;
    title?: string;
  };
  
  export type PersonalInformationInput = {
    title?: string;
    other_names?: string;
    phone_number: string;
    token_id: string;
  };
  
  // -------- Personal Info - end
  
  // -------- Staff - start
  
  export type StaffInformation = {
    personal_information: PersonalInformation;
    address?: Address;
    emergency_contact?: EmergencyContact;
    financial_information?: FinancialInformation;
  };
  
  export type Staff = {
    id: string;
    staff_information: StaffInformation;
    team?: Team;
    role?: Role;
    status?: StaffStatus;
    wage?: number;
    wage_derivation: WageOptions;
    business_id: string;
    created_at: string;
    updated_at: string;
    timesheets: Timesheet[];
  };
  
  // -------- Staff - end
  
  // -------- Teams & Roles - start
  
  export type Role = {
    id: string;
    role: string;
    staff?: Staff[];
    business_id: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Team = {
    id: string;
    name: string;
    staff_members?: Staff[];
    wage?: number;
    business_id: string;
    created_at: string;
    updated_at: string;
  };
  
  // -------- Teams & Roles - end
  
  // -------- Timesheets - start
  
  export type Timesheet = {
    id: string;
    staff: Staff;
    date: string;
    time_in: string;
    time_out: string;
    total_break?: string;
    total_hours?: string;
    status: TimeSheetStatus;
    staff_status?: StaffTimesheetStatus;
    overtime?: string;
    break_sessions: BreakSession[];
  };
  
  // -------- Timesheets - end
  
  // -------- Wages - start
  
  export type OvertimeRate = {
    percentage?: number;
    amount?: number;
  };
  
  export type OvertimeRateInput = {
    percentage?: number;
    amount?: number;
  };
  
  export type Wages = {
    overtime_rate?: OvertimeRate;
    sunday_rate?: number;
    public_holiday_rate?: number;
    saturday_rate?: number;
  };
  
  export type WagesInput = {
    overtime_rate?: OvertimeRateInput;
    sunday_rate?: number;
    public_holiday_rate?: number;
    saturday_rate?: number;
  };
  
  // -------- Wages - end
  
  // -------- Work Policies - start
  
  export type WorkPolicies = {
    work_hours: number;
    daily_fixed_rate?: boolean;
    daily_rate?: number;
    payment_frequency: PaymentFrequency;
    payment_period_start_day: PeriodStartDay;
  };
  
  export type WorkPoliciesInput = {
    work_hours: number;
    daily_fixed_rate?: boolean;
    daily_rate?: number;
    payment_frequency: PaymentFrequency;
    payment_period_start_day: PeriodStartDay;
  };
  
  // -------- Work Policies - end
  
  // -------- Business - start
  
  export type BusinessConfig = {
    work_policies?: WorkPolicies;
    wages?: Wages;
  };
  
  export type Business = {
    id: string;
    business_email: string;
    status: BusinessStatus;
    auth_provider: AuthProvider;
    created_at: string;
    updated_at: string;
    business_name: string;
    logo_url?: string;
    business_size?: number;
    business_config?: BusinessConfig;
  };
  
  // -------- Business - end
  
  // -------- Auth & User - start
  
  export type CompleteBusinessSignupData = {
    access_token: string;
  };
  
  export type CompleteBusinessSignupInput = {
    business_id: string;
    business_name: string;
    password: string;
    business_logo?: string;
    business_size?: number;
  };
  
  export type CompleteBusinessSignupPayload = {
    message: string;
    data?: CompleteBusinessSignupData;
  };
  
  export type StaffLoginPayload = {
    message: string;
    access_token: string;
    refresh_token?: string;
    staff: Staff;
  };
  
  export type StaffLogoutPayload = {
    message: string;
  };
  
  export type User = {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    first_name: string;
    other_names?: string;
    last_name?: string;
    business_id: string;
    business: Business;
    created_at: string;
    updated_at: string;
    avatar_url?: string;
  };
  
  // -------- Auth & User - end
  