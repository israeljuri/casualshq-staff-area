import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'CasualsHQ Staff Onboarding',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="bg-primary-100">
        <div className="max-w-[80rem] px-5 h-[6rem] mx-auto flex justify-between items-center">
          <Link href="/staff">
            <figure className="text-2xl font-bold text-blue-600 w-[8.292rem] h-[1.75rem]">
              <Image src="/logo.svg" alt="CasualsHQ" width={400} height={400} />
            </figure>
          </Link>
        </div>
      </header>

      <div className="min-h-screen py-20">{children}</div>
    </main>
  );
}
