'use client';

import useAlert from '@/hooks/useAlert';
 
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { staffSignIn } from '../services/authenticationService';

export const useStaffSignIn = () => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: staffSignIn,
    onSuccess: () => {
      alert.showAlert('Signed-In successfully', 'success', {
        subtext: 'Redirecting you to dashboard',
      });
      router.replace('/staff');
    },
    onError: (error) => {
      console.error('Password Reset failed (simulated):', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};
