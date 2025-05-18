'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/molecules/Button';
import searchIcon from '@/assets/input/search.svg'
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';

import { SearchableInput } from '@/components/molecules/SearchableInput';
import {
  SearchStaffData,
  SearchStaffSchema,
  Staff,
} from '@/types';

import { useState } from 'react';
import Link from 'next/link';

import { useStaffSignIn } from '@/hooks/useStaffSignIn';
import { useGetStaffs } from '@/hooks/useGetStaffs';
import { Skeleton } from '@/components/atoms/skeleton';
import { PasswordInput } from '@/components/molecules/PasswordInput';

export function SearchStaffForm() {
  const [selectedStaff, setSelectedStaff] = useState<Staff>();

  const staffsResponse = useGetStaffs();
  const staffList = staffsResponse?.data ? staffsResponse.data : [];

  const mutation = useStaffSignIn();

  const form = useForm<SearchStaffData>({
    resolver: zodResolver(SearchStaffSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  function onSubmit(values: SearchStaffData) {
    console.log('Selected staff:', selectedStaff);
    mutation.mutate(values);
  }

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    form.setValue('name', `${staff.firstName} ${staff.lastName}`);
    form.clearErrors('name');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!staffsResponse?.isPending && (
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Enter Name</FormLabel>
                <FormControl>
                  <SearchableInput
                    data={staffList}
                    searchKeys={['firstName', 'lastName', 'email']}
                    onResults={() => {}}
                    onSelectItem={handleStaffSelect}
                    placeholder="Search for your name..."
                    leftIcon={<Image src={searchIcon} alt=""/>}
                    renderResultItem={(item) => (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.firstName} {item.lastName}
                        </span>
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {staffsResponse?.isPending && (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sigining In' : 'Sign In'}
          </Button>
        </div>

        <article className="space-y-4 mt-4">
          <p className="text-center text-sm text-custom-gray">
            <Link href="/forgot-password" className="text-primary font-medium">
              Reset Password
            </Link>
          </p>
        </article>
      </form>
    </Form>
  );
}
