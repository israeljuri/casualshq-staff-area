'use client';

import PersonalInformationForm from '@/components/organisms/onBoarding//PersonalInformationForm';

export default function Onboarding() {
  return (
    <main className="space-y-14">
      <article className="grid place-items-center text-center">
        <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[0.875rem] font-medium text-custom-gray mb-2 gap-2">
          <span className="rounded-full h-[1.5rem] w-[1.5rem] grid place-items-center bg-primary font-bold text-white">
            1
          </span>
          Step 1 of 2
        </div>
        <h1 className="text-[2rem] font-medium text-gray-900">
          Personal information
        </h1>
        <p className="text-base text-custom-gray mt-2 leading-6 max-w-[43ch]">
          Please provide the following information.
        </p>
      </article>

      <section className="bg-white px-5 md:px-30 py-10 border rounded-[1.5rem] shadow-none md:shadow-md w-full md:w-[596px] mx-auto">
        <PersonalInformationForm />
      </section>
    </main>
  );
}
