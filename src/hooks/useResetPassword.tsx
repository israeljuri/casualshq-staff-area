'use client';

import useAlert from '@/hooks/useAlert';
import { resetPassword } from '../services/authentication.service';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ResetPasswordData } from '../types';

export const useResetPassword = (token: string) => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data, token),
    onSuccess: () => {
      // alert.showAlert('Password Changed', 'success', {
      //   subtext: 'Your new password has been set up to your account',
      // });
      router.replace('/sign-in');
    },
    onError: (error) => {
      console.error('Password Reset failed (simulated):', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};
