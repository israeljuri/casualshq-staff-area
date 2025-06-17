'use client';

import { useOnboardingStore } from '@/store/onBoarding.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';
import { Button } from '@/components/molecules/Button';
import { Input } from '@/components/molecules/Input';
import { FinancialInformationData, FinancialInformationSchema } from '@/types';
import { useEffect } from 'react';
import { useOnboardStaffFinancialInformationMutation } from '@/hooks/useOnboardingMutations';

const FinancialInformationForm = () => {
  const router = useRouter();

  // Store - Get data from onboarding store
  const tokenId = useOnboardingStore((state) => state.tokenId);
  const stage = useOnboardingStore((state) => state.stage);
  const setStage = useOnboardingStore((state) => state.setStage);
  const setFinancialInformationData = useOnboardingStore(
    (state) => state.setFinancialInformationData
  );

  // API - Mutations
  const { mutate, isPending, data } =
    useOnboardStaffFinancialInformationMutation();

  // Form - Create form, form submission and general form validation
  const form = useForm<FinancialInformationData>({
    resolver: zodResolver(FinancialInformationSchema),
    defaultValues: {},
  });

  function onSubmit(values: FinancialInformationData) {
    setFinancialInformationData(values);
    mutate({
      tax_file_number: values.tfn,
      bank_bsb: values.bankDetails.bsb,
      account_name: values.bankDetails.name,
      account_number: values.bankDetails.account,
      super_fund_name: values.superAnnuation.name,
      fund_abn: values.superAnnuation.abn,
      super_fund_usi: values.superAnnuation.usi,
      member_number: values.superAnnuation.memberNumber,
      token_id: tokenId!,
    });
    if (data?.stage) setStage(data.stage);
    router.push('/onboarding/completed');
  }

  useEffect(() => {
    if (
      stage === 'PERSONAL_INFORMATION' ||
      stage === 'ADDRESS' ||
      stage === 'EMERGENCY_CONTACT'
    ) {
      router.back();
    }
  }, [stage]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <section className="space-y-6">
          <div className="rounded-[1rem] border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-base font-medium">Tax details</h4>
            </article>
            <FormField
              control={form.control}
              name="tfn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Tax File Name (TFN)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax file number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-[1rem] border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-base font-medium">Bank details</h4>
            </article>
            <FormField
              control={form.control}
              name="bankDetails.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Name on bank account
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name on bank account"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankDetails.bsb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">Account BSB</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank BSB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankDetails.account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Account number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-[1rem] border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-base font-medium">Superannuation</h4>
            </article>
            <FormField
              control={form.control}
              name="superAnnuation.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Super fund name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter super fund name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="superAnnuation.abn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Super fund ABN
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter super fund ABN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="superAnnuation.usi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Super fund USI
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter super fund USI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="superAnnuation.memberNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem]">
                    Super fund member number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter super fund member number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className={'grid w-full'}>
          <Button
            disabled={isPending}
            type="submit"
            variant="primary"
            size="lg"
          >
            {isPending ? 'Setting up account' : 'Complete'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinancialInformationForm;
