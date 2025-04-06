'use client'; // Make this a client component

import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Blurred Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 filter blur-2xl opacity-20 -z-10"></div>
      <div className="absolute inset-0 bg-[#0D0D0D] opacity-90 -z-20"></div>

      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
