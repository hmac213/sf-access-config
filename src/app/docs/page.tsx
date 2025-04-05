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
            Learn how to install, use, and customize eclectech to enhance your website's accessibility.
          </p>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Installation Guide */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Installation Guide</h2>
          <p className="mb-4">To install eclectech, run the following command in your terminal:</p>
          <pre className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            npm install eclectech
          </pre>
        </section>

        {/* Usage Guide */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Usage Guide</h2>
          <p className="mb-4">Add the following HTML tag to your site:</p>
          <pre className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            &lt;eclec-tech /&gt;
          </pre>
        </section>

        {/* Control Attributes */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Control</h2>
          <p className="mb-4">
            Use the following attributes on the <code className="bg-gray-200 px-1 rounded">eclec-tech</code> tag to customize behavior:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li><strong>enable-high-contrast</strong>: Makes the website high contrast for visually impaired individuals.</li>
            <li><strong>enable-large-font</strong>: Adjusts the website to display larger text for improved readability.</li>
            <li><strong>screen-readable</strong>: Optimizes the site for screen readers, enhancing accessibility.</li>
            <li><strong>enable-transcription</strong>: Generates subtitles for embedded videos, aiding comprehension.</li>
          </ul>
        </section>

        {/* Expandable Components Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 border-b pb-2">Expandable Components</h2>
          <p className="text-lg">
            This documentation is designed to be easily expandable. You can add new sections or components by creating new React components and importing them into this page. This modular approach allows for quick updates and scalability as new features are added.
          </p>
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