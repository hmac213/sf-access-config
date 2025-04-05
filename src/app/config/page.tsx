'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ConfigSettings {
  [key: string]: boolean;
}

export default function Config() {
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string>('/landing');
  const [siteOrigin, setSiteOrigin] = useState<string>('');
  const [sitePath, setSitePath] = useState<string>('');
  const [configSettings, setConfigSettings] = useState<ConfigSettings>({});

  useEffect(() => {
    // Extract all parameters from the URL
    const site = searchParams.get('site');
    const path = searchParams.get('path');
    const config = searchParams.get('config');
    const urlParam = searchParams.get('returnUrl');
    
    // Store parameters in state
    if (site) setSiteOrigin(decodeURIComponent(site));
    if (path) setSitePath(decodeURIComponent(path));
    if (config) {
      const decodedConfig = decodeURIComponent(config);
      
      // Safely parse the config JSON
      try {
        const parsedConfig = JSON.parse(decodedConfig);
        
        // Convert all config values to boolean
        const normalizedConfig: ConfigSettings = {};
        parsedConfig.forEach((value: string) => {
          normalizedConfig[value] = true;
        });
        
        setConfigSettings(normalizedConfig);
        console.log('Normalized config settings:', normalizedConfig);
      } catch (error) {
        console.error('Error parsing config JSON:', error);
        // Try to handle it as URL parameters format

      }
    }
    
    // Handle return URL
    if (urlParam) {
      try {
        if (urlParam.startsWith('/') || new URL(urlParam).protocol.match(/^https?:$/)) {
          setReturnUrl(urlParam);
        }
      } catch (error) {
        console.warn('Invalid return URL provided:', urlParam);
      }
    } else if (site) {
      // If no returnUrl is provided but site is, construct a return URL from site and path
      try {
        const decodedSite = decodeURIComponent(site);
        let decodedPath = '';
        
        // Make sure we only get the path part without any query parameters
        if (path) {
          // Extract just the path portion without query parameters
          const pathOnly = decodeURIComponent(path).split('?')[0];
          decodedPath = pathOnly;
        }
        
        console.log('Site:', site);
        console.log('Path:', path);
        console.log('Decoded site:', decodedSite);
        console.log('Decoded path (without query params):', decodedPath);
        
        const constructedUrl = decodedSite + (decodedPath.startsWith('/') ? decodedPath : '/' + decodedPath);
        console.log('Constructed return URL:', constructedUrl);
        setReturnUrl(constructedUrl);
      } catch (error) {
        console.warn('Could not construct return URL from site and path:', error);
      }
    }
  }, [searchParams]);

  // Format the URL with enabled settings as a JSON array
  const getFormattedReturnUrl = (): string => {
    // Get only the enabled settings
    const enabledSettings: string[] = [];
    Object.entries(configSettings).forEach(([key, value]) => {
      if (value === true) {
        enabledSettings.push(key);
      }
    });
    
    // Start with the base URL
    let formattedUrl = returnUrl;
    
    // Don't add any parameters if no settings are enabled
    if (enabledSettings.length === 0) {
      return formattedUrl;
    }
    
    // Convert the array to a JSON string
    const settingsArray = JSON.stringify(enabledSettings);
    
    // URI encode the JSON array
    const encodedSettings = encodeURIComponent(settingsArray);
    
    // Add the encoded array as a 'config' parameter
    formattedUrl += `?config=${encodedSettings}`;
    
    return formattedUrl;
  };

  const handleReturn = () => {
    // Get the properly formatted return URL with enabled settings
    const finalReturnUrl = getFormattedReturnUrl();
    
    console.log('Returning to URL with settings:', finalReturnUrl);
    
    // Try multiple strategies for closing and redirecting
    try {
      // Strategy 1: Try to redirect the opener (parent) window and close this one
      if (window.opener) {
        // Redirect the parent window to our destination
        window.opener.location.href = finalReturnUrl;
        // Then close this window
        window.close();
        return; // If successful, exit the function
      }
      
      // Strategy 2: Open the URL in a new window/tab, then try to close this one
      const newWindow = window.open(finalReturnUrl, '_blank');
      
      // If the new window was successfully opened, close this one
      if (newWindow) {
        window.close();
        return; // If successful, exit the function
      }
      
      // Strategy 3: Fallback - just redirect this window
      window.location.href = finalReturnUrl;
    } catch (error) {
      console.error('Error during window management:', error);
      // Final fallback - always make sure we redirect
      window.location.href = finalReturnUrl;
    }
  };

  // Check if a specific config setting is enabled
  const isEnabled = (key: string): boolean => {
    return !!configSettings[key];
  };

  // Toggle a config setting
  const toggleSetting = (key: string) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Blurred Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 filter blur-2xl opacity-20 -z-10"></div>
      <div className="absolute inset-0 bg-[#0D0D0D] opacity-90 -z-20"></div>

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-4">
          <div className="text-2xl font-bold">eqlec.tech</div>
          <nav className="space-x-4">
            <Link href="/landing" className="text-sm text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-gray-300 hover:text-white transition">
              Docs
            </Link>
          </nav>
        </header>

        {/* Config Form Section */}
        <main className="flex flex-col items-center justify-start flex-1 px-4 py-8">
          <div className="w-full max-w-3xl mx-auto bg-black bg-opacity-50 rounded-2xl border border-gray-800 p-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">
              Accessibility Configuration
            </h1>
            <p className="text-gray-300 mb-8">
              Customize your accessibility settings to enhance user experience.
            </p>

            {/* Config Form */}
            <div className="space-y-8">
              {/* Visual Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Visual Settings</h2>
                <div className="space-y-4">
                  <ToggleItem 
                    label="High Contrast Mode" 
                    description="Enhance visibility with increased color contrast"
                    checked={isEnabled('enable-high-contrast')}
                    id="enable-high-contrast"
                    onToggle={() => toggleSetting('enable-high-contrast')}
                  />
                  <ToggleItem 
                    label="Larger Text" 
                    description="Increase default font size for better readability"
                    checked={isEnabled('enable-large-font')}
                    id="enable-large-font"
                    onToggle={() => toggleSetting('enable-large-font')}
                  />
                </div>
              </section>

              {/* Interaction Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Interaction Settings</h2>
                <div className="space-y-4">
                  <ToggleItem 
                    label="Screen Reader Optimization" 
                    description="Improve compatibility with assistive technologies"
                    checked={isEnabled('enable-screen-reader')}
                    id="enable-screen-reader"
                    onToggle={() => toggleSetting('enable-screen-reader')}
                  />
                </div>
              </section>
            </div>

            {/* Configuration Debug Section */}
            <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Configuration Parameters</h3>
              <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                {JSON.stringify(configSettings, null, 2)}
              </pre>
            </div>

            {/* Return URL Preview */}
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Return URL Preview</h3>
              <div className="text-xs text-gray-400 break-all overflow-auto max-h-40">
                <p className="mb-2 text-gray-300">When you click Return, you will be redirected to:</p>
                <code className="bg-gray-800 p-2 rounded block overflow-x-auto">
                  {getFormattedReturnUrl()}
                </code>
                <p className="mt-2 text-gray-400">
                  The enabled settings are passed as a JSON array in the 'config' parameter.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button 
                onClick={handleReturn}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Return
              </button>
            </div>
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

// Toggle Component
interface ToggleItemProps {
  label: string;
  description: string;
  checked?: boolean;
  id: string;
  onToggle: () => void;
}

function ToggleItem({ label, description, checked = false, id, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-gray-800">
      <div>
        <h3 className="font-medium text-white">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={onToggle}
          id={id}
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:via-purple-500 peer-checked:to-blue-500"></div>
      </label>
    </div>
  );
}