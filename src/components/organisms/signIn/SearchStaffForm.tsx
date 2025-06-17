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

import { SearchStaffData, SearchStaffSchema } from '@/types';

import { useState } from 'react';

import { Skeleton } from '@/components/atoms/skeleton';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { useStaffSignIn } from '@/hooks/useStaffSignIn';
import { SearchInput } from '@/components/molecules/SearchInput';
import { useStaffSearch } from '@/hooks/useAuthenticationMutations';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '@/graphql/mutations';
import useAlert from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';
import { authAdminCookies } from '@/lib/authCookies';
import { LogOut } from 'lucide-react';

export function SearchStaffForm() {
  const alert = useAlert();
  const router = useRouter();
  const [selectedStaff, setSelectedStaff] = useState<{
    id: string;
    name: string;
  }>();

  const searchStaff = useStaffSearch();
  const { mutate, isPending } = useStaffSignIn();

  const form = useForm<SearchStaffData>({
    resolver: zodResolver(SearchStaffSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  function onSubmit(values: SearchStaffData) {
    if (!selectedStaff) return;
    mutate({
      staffLoginId: selectedStaff.id,
      password: values.password,
      context: 'WEB',
    });
  }

  const handleStaffSelect = (staff: { id: string; name: string }) => {
    setSelectedStaff(staff);
    form.setValue('name', `${staff.name}`);
    form.clearErrors('name');
  };

  const [logout, { loading }] = useMutation(LOGOUT, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: () => {
      authAdminCookies.clear();
      router.replace('/admin-sign-in');
    },
  });

  const handleLogout = () => logout();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-6"
      >
        <Button
          type="button"
          disabled={loading}
          variant="outline"
          className="fixed bottom-4 right-10 z-50 bg-[#FF0000] hover:bg-[#ff4848] text-white"
          leftIcon={<LogOut className="h-5 w-5 text-white" />}
          onClick={handleLogout}
        >
          {loading ? 'Please wait' : 'Logout'}
        </Button>

        {!searchStaff.isPending && (
          <div className="grid grid-cols-[1fr_auto] items-start gap-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <SearchInput
                      {...field}
                      placeholder={'Search for your name...'}
                      isLoading={searchStaff.isPending}
                      results={searchStaff.data?.data || []}
                      onResultSelect={handleStaffSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              disabled={searchStaff.isPending}
              onClick={() => {
                searchStaff.mutate(form.getValues('name'));
              }}
            >
              Search
            </Button>
          </div>
        )}

        {searchStaff.isPending && (
          <Skeleton className="w-full h-[4.5rem] rounded-xl" />
        )}

        {selectedStaff && (
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
        )}

        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Please wait' : 'Proceed'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
