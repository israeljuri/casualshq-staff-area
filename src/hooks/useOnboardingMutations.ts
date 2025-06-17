import useAlert from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { verifyToken } from '@/services/verifyToken.service';
import {
  onboardStaffAddress,
  onboardStaffPersonalInformation,
  onboardStaffEmergencyContact,
  onboardStaffFinancialInformation,
  onboardStaffPassword,
} from '@/services/onboarding.service';

export const useVerifyTokenMutation = () => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => verifyToken(token),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Verification link expired.', 'error', {
          subtext: data.message,
        });
        return router.replace('/');
      }
    },
    onError: (error) => {
      console.error('Token verification failed (simulated):', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useOnboardStaffPersonalInformationMutation = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: (data: {
      title: string;
      other_names: string;
      phone_number: string;
      token_id: string;
    }) => onboardStaffPersonalInformation(data),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Personal information failed:', 'error', {
          subtext: data.message,
        });
      }

      alert.showAlert('Personal information added successfully', 'success', {
        subtext: data.message,
      });
    },
    onError: (error) => {
      console.error('Personal information failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useOnboardStaffAddressMutation = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: (data: {
      address: string;
      state: string;
      country: string;
      street: string;
      city: string;
      postcode: number;
      token_id: string;
    }) => onboardStaffAddress(data),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Address failed:', 'error', {
          subtext: data.message,
        });
      }

      alert.showAlert('Address added successfully', 'success', {
        subtext: data.message,
      });
    },
    onError: (error) => {
      console.error('Address failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useOnboardStaffEmergencyContactMutation = () => {  
  const alert = useAlert();

  return useMutation({
    mutationFn: (data: {
      relationship: string;
      name: string;
      phone_number: string;
      address: string;
      token_id: string;
    }) => onboardStaffEmergencyContact(data),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Emergency contact failed:', 'error', {
          subtext: data.message,
        });
      }

      alert.showAlert('Emergency contact added successfully', 'success', {
        subtext: data.message,
      });
    },
    onError: (error) => {
      console.error('Emergency contact failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useOnboardStaffFinancialInformationMutation = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: (data: {
      tax_file_number: string;
      bank_bsb: string;
      account_name: string;
      account_number: string;
      super_fund_name: string;
      fund_abn: string;
      super_fund_usi: string;
      member_number: string;
      token_id: string;
    }) => onboardStaffFinancialInformation(data),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Financial information failed:', 'error', {
          subtext: data.message,
        });
      }

      alert.showAlert('Financial information added successfully', 'success', {
        subtext: data.message,
      });
    },
    onError: (error) => {
      console.error('Financial information failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useOnboardStaffPasswordMutation = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: (data: {
      password: string;
      token_id: string;
    }) => onboardStaffPassword(data),
    onSuccess: (data) => {
      console.log({data})
      if (!data.success) {
        alert.showAlert('Password failed:', 'error', {
          subtext: data.message,
        });
      }

      alert.showAlert('Password added successfully', 'success', {
        subtext: data.message,
      });
    },
    onError: (error) => {
      console.error('Password failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};