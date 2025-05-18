'use client';

import { useOnboardingStore } from '@/store/onBoarding.store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PersonalInformationData, PersonalInformationSchema } from '@/types';
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
import { cn } from '@/lib/utils';
import { Input } from '@/components/molecules/Input';
import useAlert from '@/hooks/useAlert';
import { Select } from '@/components/molecules/Select';

const PersonalInformationForm = () => {
  const router = useRouter();
  const alert = useAlert();
  const [step, setStep] = useState(0);
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setPersonalInformationData = useOnboardingStore(
    (state) => state.setPersonalInformationData
  );
  const account = useOnboardingStore((state) => state.account);
  const increment = () => setStep(step + 1);
  const decrement = () => setStep(step - 1);

  const form = useForm<PersonalInformationData>({
    resolver: zodResolver(PersonalInformationSchema),
    defaultValues: {
      ...account,
    },
  });

  function onSubmit(values: PersonalInformationData) {
    setPersonalInformationData(values);
    router.push('/onboarding/financial-information');
  }

  const runValidation = () => {
    try {
      PersonalInformationSchema.parse(form.getValues());
    } catch (error) {
      alert.showAlert('Validation Error', 'error', {
        subtext: 'Make sure all required infos are provided',
      });
      console.log('Validation error', error)
    }
  };

  useEffect(() => {
    if (currentStep !== 2) {
      router.back();
    }
  }, []);

  const options = [
    { label: 'Mr.', value: 'mr' },
    { label: 'Mrs.', value: 'mrs' },
    { label: 'Miss', value: 'miss' },
    { label: 'Ms.', value: 'ms' },
    { label: 'Dr.', value: 'dr' },
    { label: 'Prof.', value: 'prof' },
    { label: 'Engr.', value: 'engr' },
  ];

  const optionsRelationships = [
    { label: 'Parent', value: 'parent' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Spouse', value: 'spouse' },
    { label: 'Child', value: 'child' },
    { label: 'Relative', value: 'relative' },
    { label: 'Friend', value: 'friend' },
    { label: 'Partner', value: 'partner' },
    { label: 'Guardian', value: 'guardian' },
    { label: 'Colleague', value: 'colleague' },
    { label: 'Neighbor', value: 'neighbor' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="grid grid-cols-3 gap-4">
          <span className="bg-primary w-full h-2 rounded-full"></span>
          <span
            className={cn(
              'bg-gray-200 w-full h-2 rounded-full',
              step > 0 && 'bg-primary'
            )}
          ></span>
          <span
            className={cn(
              'bg-gray-200 w-full h-2 rounded-full',
              step > 1 && 'bg-primary'
            )}
          ></span>
        </div>

        <div className=" ">
          {step === 0 && (
            <section className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Select
                        // disabled
                        placeholder="Select title"
                        {...field}
                        options={options}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other name(s)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter other name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <FormField
                control={form.control}
                name="homeAddress.line"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeAddress.streetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeAddress.postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <FormField
                control={form.control}
                name="emergencyContactInformation.relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select relationship"
                        {...field}
                        options={optionsRelationships}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactInformation.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactInformation.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactInformation.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          )}
        </div>

        <div
          className={cn(
            'grid w-full',
            step && 'flex items-center justify-between w-full'
          )}
        >
          {Boolean(step) && (
            <Button
              variant="outline"
              type="button"
              onClick={decrement}
              leftIcon={<ArrowLeft />}
              size="lg"
            >
              Previous
            </Button>
          )}
          {Boolean(step < 2) && (
            <Button
              variant="primary"
              type="button"
              onClick={increment}
              rightIcon={<ArrowRight color="white" />}
              size="lg"
            >
              Next
            </Button>
          )}

          {Boolean(step === 2) && (
            <Button
              type="submit"
              variant="primary"
              onClick={runValidation}
              rightIcon={<ArrowRight color="white" />}
              size="lg"
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;
