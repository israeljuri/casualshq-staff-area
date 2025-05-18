import { Skeleton } from '@/components/atoms/skeleton';
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const page = () => {
  return (
    <main>
      <header className="bg-primary-100">
        <div className="max-w-[80rem] px-5 h-[6rem] mx-auto flex justify-between items-center">
          <Link href="/sign-in">
            <Image
              src="/logo.png"
              alt="CasualsHQ Logo"
              className="w-40"
              width={500}
              height={500}
            />
          </Link>
        </div>
      </header> 
      <article className="grid place-items-center text-center mb-8 pt-20">
        <h1 className="text-3xl font-medium text-gray-900">
          Reset your password
        </h1>
        <p className="text-sm text-custom-gray mt-2 leading-6">
          Enter a new password to reset your password.
        </p>
      </article>
      <section className="px-5 md:px-30 py-10 rounded-xl border shadow-none md:shadow-md w-full md:max-w-[596px] mx-auto space-y-16">
        <Suspense fallback={<Skeleton className="h-[20rem] w-full" />}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
};

export default page;
