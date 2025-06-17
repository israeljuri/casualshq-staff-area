'use client';

import { useOnboardingStore } from '@/store/onBoarding.store';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  PersonalInformationData,
  PersonalInformationSchema,
  AddressData,
  AddressSchema,
  EmergencyContactInformationData,
  EmergencyContactInformationSchema,
} from '@/types';
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
import { Select } from '@/components/molecules/Select';
import {
  useOnboardStaffAddressMutation,
  useOnboardStaffEmergencyContactMutation,
  useOnboardStaffPersonalInformationMutation,
} from '@/hooks/useOnboardingMutations';

const options = [
  { label: 'Mr', value: 'mr' },
  { label: 'Mrs', value: 'mrs' },
  { label: 'Miss', value: 'miss' },
  { label: 'Ms', value: 'ms' },
  { label: 'Dr', value: 'dr' },
  { label: 'Prof', value: 'prof' },
  { label: 'Engr', value: 'engr' },
];

const optionsRelationships = [
  { label: 'Parent', value: 'parent' },
  { label: 'Sibling', value: 'sibling' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Child', value: 'child' },
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Other', value: 'other' },
];

const optionsCountryandState = {
  countries: [
    {
      label: 'Australia',
      value: 'AU',
    },
  ],
  statesByCountry: {
    AU: [
      {
        label: 'Australian Capital Territory',
        value: 'ACT',
      },
      {
        label: 'New South Wales',
        value: 'NSW',
      },
      {
        label: 'Northern Territory',
        value: 'NT',
      },
      {
        label: 'Queensland',
        value: 'QLD',
      },
      {
        label: 'South Australia',
        value: 'SA',
      },
      {
        label: 'Tasmania',
        value: 'TAS',
      },
      {
        label: 'Victoria',
        value: 'VIC',
      },
      {
        label: 'Western Australia',
        value: 'WA',
      },
    ],
  },
};

const PersonalInformationForm = () => {
  const router = useRouter();

  // Store - Get data from onboarding store
  const stage = useOnboardingStore((state) => state.stage);
  const setStage = useOnboardingStore((state) => state.setStage);
  const tokenId = useOnboardingStore((state) => state.tokenId);

  const personalInformation = useOnboardingStore(
    (state) => state.personalInformation
  );
  const address = useOnboardingStore((state) => state.address);
  const emergencyContact = useOnboardingStore(
    (state) => state.emergencyContactInformation
  );
  const setPersonalInformationData = useOnboardingStore(
    (state) => state.setPersonalInformationData
  );
  const setAddressData = useOnboardingStore((state) => state.setAddressData);
  const setEmergencyContactInformationData = useOnboardingStore(
    (state) => state.setEmergencyContactInformationData
  );
  const setFinancialInformationData = useOnboardingStore(
    (state) => state.setFinancialInformationData
  );

  // API - Mutations
  const personalInformationMutation =
    useOnboardStaffPersonalInformationMutation();
  const addressMutation = useOnboardStaffAddressMutation();
  const emergencyContactInformationMutation =
    useOnboardStaffEmergencyContactMutation();

  // Forms - Create form, form submission and general form validation
  const personalInformationForm = useForm<PersonalInformationData>({
    resolver: zodResolver(PersonalInformationSchema),
    defaultValues: {
      ...personalInformation,
    },
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      ...address,
    },
  });

  const emergencyContactForm = useForm<EmergencyContactInformationData>({
    resolver: zodResolver(EmergencyContactInformationSchema),
    defaultValues: {
      ...emergencyContact,
    },
  });

  function onSubmitPersonalInformationForm(values: PersonalInformationData) {
    personalInformationMutation.mutate({
      title: values.title,
      other_names: values.otherName!,
      phone_number: values.phoneNumber,
      token_id: tokenId!,
    });
    if (personalInformationMutation.data?.stage)
      setStage(personalInformationMutation.data.stage);
    setPersonalInformationData(values);
  }

  function onSubmitAddressForm(values: AddressData) {
    addressMutation.mutate({
      address: values.line,
      street: values.streetName,
      city: values.city,
      postcode: Number(values.postcode),
      country: values.country,
      state: values.state,
      token_id: tokenId!,
    });
    if (addressMutation.data?.stage) setStage(addressMutation.data.stage);
    setAddressData(values);
  }

  function onSubmitEmergencyContactForm(
    values: EmergencyContactInformationData
  ) {
    emergencyContactInformationMutation.mutate({
      relationship: values.relationship,
      name: values.name,
      phone_number: values.phoneNumber,
      address: values.address,
      token_id: tokenId!,
    });
    if (emergencyContactInformationMutation.data?.stage)
      setStage(emergencyContactInformationMutation.data.stage);
    setEmergencyContactInformationData(values);
    router.push('/onboarding/financial-information');
  }

  // Destructure country/state data
  const { countries, statesByCountry } = optionsCountryandState;

  // Watch the selected country
  const selectedCountry = useWatch({
    control: addressForm.control,
    name: 'country',
  });

  // Dynamically determine states
  const stateOptions = selectedCountry
    ? statesByCountry[selectedCountry as keyof typeof statesByCountry] || []
    : [];

  // Restoring stage -  Redirect based on stage
  useEffect(() => {
    if (stage === 'PASSWORD_SETUP') {
      router.back();
    }

    if (stage === 'FINANCIAL_INFORMATION') {
      router.push('/onboarding/financial-information');
    }
  }, [stage]);

  // Restoring stage - Set onboarding fields for restoring state
  useEffect(() => {
    if (personalInformationMutation.data?.data) {
      addressForm.setValue(
        'line',
        personalInformationMutation.data?.data.address
      );
      addressForm.setValue(
        'streetName',
        personalInformationMutation.data?.data.street
      );
      addressForm.setValue('city', personalInformationMutation.data?.data.city);
      addressForm.setValue(
        'postcode',
        String(personalInformationMutation.data?.data.postcode || '')
      );
      addressForm.setValue(
        'country',
        personalInformationMutation.data?.data.country || ''
      );
      addressForm.setValue(
        'state',
        personalInformationMutation.data?.data.state || ''
      );
    }

    if (addressMutation.data?.data) {
      emergencyContactForm.setValue(
        'relationship',
        addressMutation.data?.data.relationship || ''
      );
      emergencyContactForm.setValue('name', addressMutation.data?.data.name || '');
      emergencyContactForm.setValue(
        'phoneNumber',
        addressMutation.data?.data.phone_number || ''
      );
      emergencyContactForm.setValue(
        'address',
        addressMutation.data?.data.address || ''
      );
    }

    if (emergencyContactInformationMutation.data?.data) {
      setFinancialInformationData({
        tfn: emergencyContactInformationMutation.data?.data.tax_file_number || '',
        bankDetails: {
          name: emergencyContactInformationMutation.data?.data.account_name || '',
          bsb: emergencyContactInformationMutation.data?.data.bank_bsb || '',
          account:
            emergencyContactInformationMutation.data?.data.account_number || '',
        },
        superAnnuation: {
          name: emergencyContactInformationMutation.data?.data.super_fund_name || '',
          abn: emergencyContactInformationMutation.data?.data.fund_abn || '',
          usi: emergencyContactInformationMutation.data?.data.super_fund_usi || '',
          memberNumber:
            emergencyContactInformationMutation.data?.data.member_number || '',
        },
      });
    }
  }, [
    personalInformationMutation.data,
    addressMutation.data,
    emergencyContactInformationMutation.data,
  ]);

  return (
    <>
      {stage === 'PERSONAL_INFORMATION' && (
        <Form {...personalInformationForm}>
          <form
            onSubmit={personalInformationForm.handleSubmit(
              onSubmitPersonalInformationForm
            )}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <span className="bg-primary w-full h-2 rounded-full"></span>
              <span className="bg-gray-200 w-full h-2 rounded-full"></span>
              <span className="bg-gray-200 w-full h-2 rounded-full"></span>
            </div>

            <div className=" ">
              <section className="space-y-6">
                <FormField
                  control={personalInformationForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Select
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
                  control={personalInformationForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInformationForm.control}
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
                  control={personalInformationForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInformationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInformationForm.control}
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
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStage('PASSWORD_SETUP')}
                size="lg"
              >
                Previous
              </Button>

              <Button
                type="submit"
                disabled={personalInformationMutation.isPending}
                variant="primary"
                size="lg"
              >
                {personalInformationMutation.isPending ? 'Please wait' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {stage === 'ADDRESS' && (
        <Form {...addressForm}>
          <form
            onSubmit={addressForm.handleSubmit(onSubmitAddressForm)}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <span className="bg-primary w-full h-2 rounded-full"></span>
              <span className="bg-primary w-full h-2 rounded-full"></span>
              <span className="bg-gray-200 w-full h-2 rounded-full"></span>
            </div>

            <div className=" ">
              <section className="space-y-6">
                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select country"
                          {...field}
                          options={countries}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select state"
                          {...field}
                          options={stateOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="line"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment/Building Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter apartment/building number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="streetName"
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
                  control={addressForm.control}
                  name="city"
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
                  control={addressForm.control}
                  name="postcode"
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
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStage('PERSONAL_INFORMATION')}
                size="lg"
              >
                Previous
              </Button>

              <Button
                type="submit"
                disabled={addressMutation.isPending}
                variant="primary"
                size="lg"
              >
                {addressMutation.isPending ? 'Please wait' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {stage === 'EMERGENCY_CONTACT' && (
        <Form {...emergencyContactForm}>
          <form
            onSubmit={emergencyContactForm.handleSubmit(
              onSubmitEmergencyContactForm
            )}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <span className={'bg-primary w-full h-2 rounded-full'}></span>
              <span className={'bg-primary w-full h-2 rounded-full'}></span>
              <span className="bg-primary w-full h-2 rounded-full"></span>
            </div>

            <div className=" ">
              <section className="space-y-6">
                <FormField
                  control={emergencyContactForm.control}
                  name="relationship"
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
                  control={emergencyContactForm.control}
                  name="name"
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
                  control={emergencyContactForm.control}
                  name="phoneNumber"
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
                  control={emergencyContactForm.control}
                  name="address"
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
            </div>

            <div className={'grid w-full grid-cols-2 gap-4'}>
              <Button
                variant="outline"
                type="button"
                onClick={() => setStage('ADDRESS')}
                size="lg"
              >
                Previous
              </Button>

              <Button
                type="submit"
                disabled={emergencyContactInformationMutation.isPending}
                variant="primary"
                size="lg"
              >
                {emergencyContactInformationMutation.isPending
                  ? 'Please wait'
                  : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default PersonalInformationForm;
