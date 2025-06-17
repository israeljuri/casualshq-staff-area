import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { AdminSignInForm } from '@/components/organisms/signIn/AdminSignInForm';

export const metadata: Metadata = {
  title: 'Admin Sign In | CasualsHQ',
  description: "Admin Sign in to access your organization's workspace.",
};

const SignIn = () => {
  return (
    <main>
      <header className="bg-primary-100">
        <div className="max-w-[80rem] px-5 h-[6rem] mx-auto flex justify-between items-center">
          <Link href="/sign-in">
            <figure className="text-2xl font-bold text-blue-600 w-[8.292rem] h-[1.75rem]">
              <Image src="/logo.svg" alt="CasualsHQ" width={400} height={400} />
            </figure>
          </Link>
        </div>
      </header>

      <article className="grid place-items-center text-center mb-8 pt-20">
        <h1 className="text-3xl font-medium text-gray-900">Sign In</h1>
        <p className="text-sm text-custom-gray mt-2 leading-6 max-w-[35ch]">
          Log into your account to get started.
        </p>
      </article>

      <section className="bg-white px-5 md:px-30 py-10 mb-20 border rounded-xl shadow-none md:shadow-md w-full md:w-[596px] mx-auto">
        <AdminSignInForm />
      </section>
    </main>
  );
};

export default SignIn;
