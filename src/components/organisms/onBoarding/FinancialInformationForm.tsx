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
import { useAccountSetup } from '@/hooks/useAccountSetup';

const FinancialInformationForm = () => {
  const router = useRouter();
  const accountSetupResponse = useAccountSetup();

  const setFinancialInformationData = useOnboardingStore(
    (state) => state.setFinancialInformationData
  );
  const currentStep = useOnboardingStore((state) => state.currentStep);

  const form = useForm<FinancialInformationData>({
    resolver: zodResolver(FinancialInformationSchema),
    defaultValues: {},
  });

  function onSubmit(values: FinancialInformationData) {
    setFinancialInformationData(values);
    router.push('/onboarding/completed');
  }

  useEffect(() => {
    if (currentStep !== 3) {
      router.back();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <section className="space-y-6">
          <div className="rounded-xl border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-xl">Tax details</h4>
            </article>
            <FormField
              control={form.control}
              name="tfn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax File Name (TFN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax file number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-xl border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-xl">Bank details</h4>
            </article>
            <FormField
              control={form.control}
              name="bankDetails.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on bank account</FormLabel>
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
                  <FormLabel>Account BSB</FormLabel>
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
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-xl border p-4 space-y-5">
            <article className="border-b pb-3">
              <h4 className="text-xl">Superannuation</h4>
            </article>
            <FormField
              control={form.control}
              name="superAnnuation.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Super fund name</FormLabel>
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
                  <FormLabel>Super fund ABN</FormLabel>
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
                  <FormLabel>Super fund USI</FormLabel>
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
                  <FormLabel>Super fund member number</FormLabel>
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
            disabled={accountSetupResponse.isPending}
            type="submit"
            variant="primary"
            size="lg"
          >
            {accountSetupResponse.isPending ? 'Setting up account' : 'Complete'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinancialInformationForm;
