import React from 'react';
import Link from 'next/link';

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section with Gradient Background */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-white text-center">Documentation</h1>
          <div className="text-center mt-4">
            <Link href="/" className="inline-block bg-white text-purple-600 font-semibold py-2 px-4 rounded hover:bg-gray-100">Return to Home</Link>
          </div>
          <p className="mt-4 text-xl text-gray-200 text-center">
            Comprehensive guide to install, configure, and integrate eclectech to enhance your website&apos;s accessibility and generative AI features.
          </p>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Installation Guide */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Installation Guide</h2>
          <p className="mb-4">
            To get started with eclectech, install our node package via npm. Open your terminal and run:
          </p>
          <pre className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            npm install eclectech
          </pre>
        </section>

        {/* Environment Configuration */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Environment Configuration</h2>
          <p className="mb-4">
            To enable generative AI features, create a <code>.env</code> file at the root of your project and add your Gemini API key:
          </p>
          <pre className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            GEMINI_API_KEY=your_gemini_api_key_here
          </pre>
          <p className="mt-2 text-gray-700">
            Replace <code>your_gemini_api_key_here</code> with the actual API key provided by Gemini.
          </p>
        </section>

        {/* HTML Integration */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">HTML Integration</h2>
          <p className="mb-4">
            To integrate eclectech into your website, include the following custom HTML tag in your <code>index.html</code> file. This tag initializes the accessibility and AI features on your site:
          </p>
          <pre className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            &lt;eclec-tech /&gt;
          </pre>
        </section>

        {/* Control Attributes */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Control Attributes</h2>
          <p className="mb-4">
            The following attributes will be automatically added when users specify their accessibility needs:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li><strong>enable-high-contrast</strong>: Activates a high contrast mode to assist visually impaired users.</li>
            <li><strong>enable-large-font</strong>: Adjusts text sizes across the website for better readability.</li>
            <li><strong>screen-readable</strong>: Optimizes the site for screen reader technologies, ensuring smoother navigation.</li>
            <li><strong>enable-transcription</strong>: Provides real-time transcription for embedded videos, enhancing accessibility for hearing-impaired users.</li>
          </ul>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} eclectech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}