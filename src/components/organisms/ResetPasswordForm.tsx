'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

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
import { PasswordSchema, PasswordData } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPassword } from '@/hooks/useResetPassword';

export function ResetPasswordForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const mutation = useResetPassword(token ? token : '');

  const form = useForm<PasswordData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: PasswordData) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (!token) router.replace('/');
  }, [token, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Resetting Password' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}
