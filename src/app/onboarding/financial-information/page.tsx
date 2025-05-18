'use client';

import FinancialInformationForm from '@/components/organisms/onBoarding/FinancialInformationForm';

export default function Onboarding() {
  return (
    <main className="min-h-screen">
      <article className="grid place-items-center text-center mb-8">
        <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium text-custom-gray mb-2 gap-2">
          <span className="rounded-full h-[1.5rem] w-[1.5rem] grid place-items-center bg-primary font-bold text-white">
            2
          </span>
          Step 1 of 2
        </div>
        <h1 className="text-3xl font-medium text-gray-900">
          Financial information
        </h1>
        <p className="text-sm text-custom-gray mt-2 leading-6 max-w-[50ch]">
          Please provide the following information.
        </p>
      </article>

      <section className="bg-white px-5 md:px-30 py-10 border rounded-xl shadow-none md:shadow-md w-full md:w-[596px] mx-auto">
        <FinancialInformationForm />
      </section>
    </main>
  );
}
