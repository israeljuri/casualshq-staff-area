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
import {
  CreatePasswordSchema,
  CreatePasswordData,
} from '@/types';

import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { Input } from '@/components/molecules/Input';
import { useOnboardingStore } from '@/store/onBoarding.store';
import { useEffect } from 'react';
import { useGetStaff } from '@/hooks/useGetStaff';
import { Skeleton } from '@/components/atoms/skeleton';

export function CreatePasswordForm() {
  const setPassword = useOnboardingStore((state) => state.setPassword);
  const account = useOnboardingStore((state) => state.account);
  const setAccount = useOnboardingStore((state) => state.setAccount);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const staffResponse = useGetStaff(token ? token : '');

  const form = useForm<CreatePasswordData>({
    resolver: zodResolver(CreatePasswordSchema),
    defaultValues: {
      email: account ? account.email : 'anonymous',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: CreatePasswordData) {
    setPassword(values.password);
    router.push('/onboarding/personal-information');
  }

  useEffect(() => {
    if (!token) router.replace('/');
  }, [token, router]);

  useEffect(() => {
    if (staffResponse?.data) {
      setAccount(staffResponse.data);
      return form.setValue('email', staffResponse.data.email);
    }

    if (staffResponse?.error) router.replace('/');
  }, [staffResponse]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!staffResponse?.isPending && (
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

        {staffResponse?.isPending && (
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
          <p className="text-center text-sm text-custom-gray">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-black font-semibold">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-custom-gray leading-5">
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
