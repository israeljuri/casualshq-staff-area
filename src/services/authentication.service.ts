import { ForgotPasswordData, ResetPasswordData, SearchStaffData } from "../types";

export async function staffSignIn(data: SearchStaffData): Promise<{ success: boolean }> {
  console.log('Simulating reset password with data:', data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}



export async function forgotPassword(data: ForgotPasswordData): Promise<{ success: boolean }> {
  console.log('Simulating forgot password with data:', data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export async function resetPassword(data: ResetPasswordData, token: string): Promise<{ success: boolean }> {
  console.log('Simulating reset password with data:', data, token);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
