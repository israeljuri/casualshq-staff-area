import { Staff, AccountSetupData } from '../types';

let staffData: Staff[] = []; // This will be the fake database

export const getStaffById = async (id: string): Promise<Staff> => {
  if (!staffData.length) {
    const response = await fetch('/data/staffs.json');
    const json = await response.json();
    staffData = json.staffs;
  }

  const staff = staffData.find((member) => member.id === id);
  if (!staff) throw new Error(`Staff with id ${id} not found`);
  return staff;
};

export async function completeAccountSetup(
  data: AccountSetupData
): Promise<{ success: boolean }> {
  console.log('Simulating account setup with data:', data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
