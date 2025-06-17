'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/molecules/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { CreatePasswordSchema, CreatePasswordData } from '@/types';

import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { Input } from '@/components/molecules/Input';
import { useOnboardingStore } from '@/store/onBoarding.store';
import { useEffect } from 'react';
import { Skeleton } from '@/components/atoms/skeleton';
import {
  useVerifyTokenMutation,
  useOnboardStaffPasswordMutation,
} from '@/hooks/useOnboardingMutations';

export function CreatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Store - Get data from onboarding store
  const tokenId = useOnboardingStore((state) => state.tokenId);
  const setToken = useOnboardingStore((state) => state.setToken);
  const setStage = useOnboardingStore((state) => state.setStage);
  const setPassword = useOnboardingStore((state) => state.setPassword);
  const setPersonalInformationData = useOnboardingStore(
    (state) => state.setPersonalInformationData
  );

  // Verify token mutation
  const verifySignupLink = useVerifyTokenMutation();
  const onboardStaffPasswordMutation = useOnboardStaffPasswordMutation();

  const form = useForm<CreatePasswordData>({
    resolver: zodResolver(CreatePasswordSchema),
    defaultValues: {
      email: 'anonymous',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: CreatePasswordData) {
    if (!tokenId) return;
    onboardStaffPasswordMutation.mutate({
      password: values.password,
      token_id: tokenId,
    });
    setPassword(values.password);
    setStage('PERSONAL_INFORMATION');
    router.push('/onboarding/personal-information');
  }

  // Redirect to home if no token
  useEffect(() => {
    if (!token) router.replace('/');
  }, [token, router]);

  // Verify signup link (token) on mount
  useEffect(() => {
    if (token) verifySignupLink.mutate(token);
  }, [token]);

  //  Redirect to personal information if stage is personal information
  useEffect(() => {
    if (verifySignupLink.data?.stage === 'PERSONAL_INFORMATION') {
      router.push('/onboarding/personal-information');
    }
    if (verifySignupLink.data?.stage === 'ADDRESS') {
      router.push('/onboarding/personal-information');
    }
    if (verifySignupLink.data?.stage === 'EMERGENCY_CONTACT') {
      router.push('/onboarding/personal-information');
    }
    if (verifySignupLink.data?.stage === 'FINANCIAL_INFORMATION') {
      router.push('/onboarding/financial-information');
    }
    if (verifySignupLink.data?.stage === 'COMPLETED') {
      router.push('/onboarding/completed');
    }
  }, [tokenId]);

  // Set data from verifySignupLink data to form
  useEffect(() => {
    if (verifySignupLink.data?.success) {
      form.setValue('email', verifySignupLink.data.email);
      setToken(verifySignupLink.data.token_id);
      setStage(verifySignupLink.data.stage);
      setPersonalInformationData({
        firstName: verifySignupLink.data.first_name || '',
        lastName: verifySignupLink.data.last_name || '',
        email: verifySignupLink.data.email || '',
        otherName: verifySignupLink.data.other_names || '',
        phoneNumber: verifySignupLink.data.phone_number || '',
        title: verifySignupLink.data.title || '',
      });
    }
  }, [verifySignupLink.data]);

  useEffect(() => {
    if (onboardStaffPasswordMutation.data?.success) {
      form.setValue('email', onboardStaffPasswordMutation.data.data.email);
      setStage(onboardStaffPasswordMutation.data.stage);
      setPersonalInformationData({
        firstName: onboardStaffPasswordMutation.data.data.first_name || '',
        lastName: onboardStaffPasswordMutation.data.data.last_name || '',
        email: onboardStaffPasswordMutation.data.data.email || '',
        otherName: onboardStaffPasswordMutation.data.data.other_names || '',
        phoneNumber: onboardStaffPasswordMutation.data.data.phone_number || '',
        title: onboardStaffPasswordMutation.data.data.title || '',
      });
    }
  }, [onboardStaffPasswordMutation.data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!verifySignupLink?.isPending && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="johndoe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {verifySignupLink?.isPending && (
          <Skeleton className="w-full h-[4.5rem] rounded-xl" />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter password" {...field} />
              </FormControl>
              <FormDescription className="text-custom-gray">
                Must be at least 8 characters long with one uppercase, one
                number, and one special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm password" {...field} />
              </FormControl>
              <FormDescription className="text-custom-gray text-sm">
                Must be at least 8 characters long with one uppercase, one
                number, and one special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full">
          Create Password
        </Button>

        <article className="space-y-4 mt-4">
          <p className="text-center text-[0.75rem] text-custom-gray">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-black font-semibold">
              Sign in
            </Link>
          </p>

          <p className="text-center text-[0.75rem] text-custom-gray leading-5">
            By clicking Create account, you agree to CasualsHQ’s{' '}
            <Link href="" className="text-black">
              Terms of Service
            </Link>{' '}
            &{' '}
            <Link href="" className="text-black">
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </form>
    </Form>
  );
}
