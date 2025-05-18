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
            <Image src="/logo.png" alt="CasualsHQ Logo" className="w-[10rem]" width={100} height={100} />
          </Link>
        </div>
      </header>

      <div className="min-h-screen py-20">{children}</div>
    </main>
  );
}
