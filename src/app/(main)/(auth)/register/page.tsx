"use client";

import dynamic from 'next/dynamic';

const RegisterForm = dynamic(() => import('@/features/auth/register/component/RegisterForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#c9060a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function RegisterPage() {
  return <RegisterForm />;
}