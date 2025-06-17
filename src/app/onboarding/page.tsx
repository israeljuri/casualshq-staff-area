'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/atoms/skeleton';
import { CreatePasswordForm } from '@/components/organisms/onBoarding/CreatePasswordForm';

export default function Onboarding() {
  return (
    <main className="space-y-14">
      <article className="grid place-items-center text-center">
        <h1 className="text-[2rem] font-medium text-gray-900">
          Welcome to Casuals HQ
        </h1>
        <p className="text-base text-custom-gray mt-2 leading-6 max-w-[43ch]">
          Your admin has invited you to join Casuals HQ. Create a password and
          complete your account and start tracking your hours seamlessly.
        </p>
      </article>
      <Suspense fallback={<Skeleton className="h-[30rem] w-full" />}>
        <section className="bg-white px-5 md:px-30 py-10 border rounded-[1.5rem] shadow-none md:shadow-md max-w-[596px] mx-auto">
          <CreatePasswordForm />
        </section>
      </Suspense>
    </main>
  );
}
