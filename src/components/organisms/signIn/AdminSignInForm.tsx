'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/molecules/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';
import { Input } from '@/components/molecules/Input';

import mailIcon from '@/assets/input/mail.svg';

import useAlert from '@/hooks/useAlert';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { AdminSignInData, AdminSignInSchema } from '@/types';
import { GoogleSigninButton } from './GoogleSignInButton';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '@/graphql/authenticationMutations';
import { useRouter } from 'next/navigation';
import { authAdminCookies } from '@/lib/authCookies';

export function AdminSignInForm() {
  const alert = useAlert();
  const router = useRouter();
  const [signIn, { loading }] = useMutation(SIGN_IN, {
    onError: (error) => {
      alert.showAlert('Admin Sign In Failed', 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      alert.showAlert('Admin Sign In Success', 'success', {
        subtext: 'Redirecting to staff sign-in page',
      });
      router.replace('/sign-in');
      authAdminCookies.setTokens(
        data.login.access_token,
        data.login.refresh_token
      );
    },
  });

  const form = useForm<AdminSignInData>({
    resolver: zodResolver(AdminSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: AdminSignInData) {
    signIn({
      variables: {
        input: {
          email: values.email.trim().toLocaleLowerCase(),
          password: values.password,
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<img src={mailIcon} alt="" />}
                  placeholder="johndoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sigining In' : 'Continue'}
          </Button>

          <GoogleSigninButton />

          {/* <article className="space-y-4 mt-4">
            <p className="text-center text-sm text-custom-gray">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-black font-semibold">
                Sign Up
              </Link>
            </p>
            <p className="text-center text-sm text-custom-gray">
              <Link
                href="/forgot-password"
                className="text-black font-semibold underline"
              >
                Reset Password
              </Link>
            </p>
          </article> */}
        </div>
      </form>
    </Form>
  );
}
