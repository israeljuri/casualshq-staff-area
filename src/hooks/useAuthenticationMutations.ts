'use client';

import useAlert from '@/hooks/useAlert';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  signIn,
  staffSignIn,
  staffSearch,
} from '../services/authentication.service';
import { authAdminCookies, authCookies } from '@/lib/authCookies';

export const useSignIn = () => {
  const alert = useAlert();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      signIn({ email: input.email, password: input.password }),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Admin Sign In Failed', 'error', {
          subtext: data.message,
        });
        return;
      }
      alert.showAlert('Admin Sign In Success', 'success', {
        subtext: 'Redirecting to staff sign-in page',
      });
      authAdminCookies.setTokens(data.access_token, data.refresh_token);
      if (data.success) router.replace('/sign-in');
    },
    onError: (error) => {
      console.error('Account Setup Error:', error);
      alert.showAlert('Admin Sign In Failed', 'error', {
        subtext: error.message,
      });
    },
  });
};

export const useStaffSearch = () => {
  const alert = useAlert();

  return useMutation({
    mutationFn: (query: string) => staffSearch(query),
    onSuccess: (data) => {
      if (!data.success) {
        alert.showAlert('Staff Search Failed', 'error', {
          subtext: data.message,
        });
        return;
      }
    },
    onError: (error) => {
      console.error('Staff Search Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};

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
        alert.showAlert('Staff Sign In Failed', 'error', {
          subtext: data.message,
        });
        return;
      }
      authCookies.setTokens(data.access_token, data.refresh_token);
      alert.showAlert('Staff Sign In Success', 'success', {
        subtext: 'Redirecting to staff dashboard',
      });
      router.replace('/staff');
    },
    onError: (error) => {
      console.error('Staff Sign In Error:', error);
      alert.showAlert('Staff Sign In Failed', 'error', {
        subtext: error.message,
      });
    },
  });
};
