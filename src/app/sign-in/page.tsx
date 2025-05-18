import { SearchStaffForm } from '@/components/organisms/signIn/SearchStaffForm';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Sign In | CasualsHQ',
  description: "Sign in to access your organization's workspace.",
};

const SignIn = () => {
  return (
    <main>
      <header className="bg-primary-100">
        <div className="max-w-[80rem] px-5 h-[6rem] mx-auto flex justify-between items-center">
          <Link href="/sign-in">
            <Image src="/logo.png" alt="CasualsHQ Logo" className="w-[10rem]" />
          </Link>
        </div>
      </header>

      <article className="grid place-items-center text-center mb-8 pt-20">
        <h1 className="text-3xl font-medium text-gray-900">Staff Search</h1>
        <p className="text-sm text-custom-gray mt-2 leading-6 max-w-[35ch]">
          Please search for your name to log in and access
          your&nbsp;organization&apos;s&nbsp;workspace.
        </p>
      </article>
      
      <section className="bg-white px-5 md:px-30 py-10 mb-20 border rounded-xl shadow-none md:shadow-md w-full md:w-[596px] mx-auto">
        <SearchStaffForm />
      </section>
    </main>
  );
};

export default SignIn;
