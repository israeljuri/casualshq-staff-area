'use client';

import useAlert from '@/hooks/useAlert';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { staffSignIn } from '../services/authentication.service';
import { authCookies } from '@/lib/authCookies';
import { setCookie } from 'cookies-next';

export const useStaffSignIn = () => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      staffLoginId: string;
      password: string;
      context: string;
    }) => staffSignIn(data),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Sign In Failed', 'error', {
          subtext: data.message,
        });
        return;
      }
      setCookie('user_id', data.staff.id);
      authCookies.setTokens(data.access_token);
      router.replace('/');
    },
    onError: (error) => {
      console.error('Staff Sign In failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};
