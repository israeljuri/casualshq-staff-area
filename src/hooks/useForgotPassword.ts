'use client';

import useAlert from '@/hooks/useAlert';
import { forgotPassword } from '../services/authentication.service';

import { useMutation } from '@tanstack/react-query';

export const useForgotPassword = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      alert.showAlert('Reset link sent', 'success', {
        subtext: 'A reset link has been sent to your email.',
      });
    },
    onError: (error) => {
      console.error('Password Reset failed (simulated):', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};
