import React from 'react';

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Blurred Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 filter blur-2xl opacity-20 -z-10"></div>
      <div className="absolute inset-0 bg-[#0D0D0D] opacity-90 -z-20"></div>

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-4">
          <div className="text-2xl font-bold">eqlec.tech</div>
          <div className="space-x-4">
            <a
              href="/signin"
              className="text-sm border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="text-sm bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 rounded-full font-semibold hover:opacity-90 transition"
            >
              Get Started
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">
            Accessibility Toolkit
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 mb-8">
            Built to help you create an inclusive website, eqlec is the best way to ensure your site is accessible with AI. From automated alt-text suggestions to semantic markup enhancements, eqlec streamlines your development process while making your website more inclusive.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/docs"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              For Devs
            </a>
            <a
              href="/signup"
              className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              Get Started
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} eqlec.tech. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}