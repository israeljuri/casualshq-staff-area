import { SearchStaffData } from "../types";

export async function staffSignIn(data: SearchStaffData): Promise<{ success: boolean }> {
  console.log('Simulating reset password with data:', data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
