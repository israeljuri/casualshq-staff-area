'use client';

import useAlert from '@/hooks/useAlert';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { completeAccountSetup } from '../services/onBoarding.service';

export const useAccountSetup = () => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: completeAccountSetup,
    onSuccess: () => {
      alert.showAlert('Account Setup Completed', 'success', {
        subtext: 'Redirecting you to dashboard in a moment',
      });
      setTimeout(() => {
        router.replace('/staff');
      }, 5000);
    },
    onError: (error) => {
      console.error('Account Setup Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};
