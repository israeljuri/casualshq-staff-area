import { Staff } from '../types';

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

export const getStaffs = async (): Promise<Staff[]> => {
  const response = await fetch('/data/staffs.json');
  const json = await response.json();
  return (staffData = json.staffs);
};
