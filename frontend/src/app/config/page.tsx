'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ConfigSettings {
  [key: string]: boolean;
}

function ConfigContent() {
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string>('/landing');
  const [configSettings, setConfigSettings] = useState<ConfigSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/auth/status', { credentials: 'include' })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
             setError('User not authenticated. Please log in.');
          } else {
            throw new Error(`Failed to fetch auth status: ${res.statusText}`);
          }
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.authenticated && data.user && Array.isArray(data.user.attributes)) {
          const initialSettings: ConfigSettings = {};
          data.user.attributes.forEach((attr: string) => {
            initialSettings[attr] = true;
          });
          setConfigSettings(initialSettings);
          console.log('Initialized config settings from fetched attributes:', initialSettings);
        } else if (data === null) {
        } else {
          console.warn('Could not initialize settings from fetched data:', data);
          setConfigSettings({}); 
        }
      })
      .catch(err => {
        console.error('Error fetching initial attributes:', err);
        setError(err.message || 'Failed to load settings.');
        setConfigSettings({});
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    
    const site = searchParams.get('site');
    const path = searchParams.get('path');
    const urlParam = searchParams.get('returnUrl');
    
    if (urlParam) {
      try {
        if (urlParam.startsWith('/') || new URL(urlParam).protocol.match(/^https?:$/)) {
          setReturnUrl(urlParam);
        }
      } catch {
        console.warn('Invalid return URL provided:', urlParam);
      }
    } else if (site) {
      try {
        const decodedSite = decodeURIComponent(site);
        let decodedPath = '';
        
        if (path) {
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

  const getFormattedReturnUrl = (): string => {
    const enabledSettings = Object.entries(configSettings)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
    
    let formattedUrl = returnUrl;
    
    if (enabledSettings.length === 0) {
      return formattedUrl;
    }
    
    const settingsArray = JSON.stringify(enabledSettings);
    
    const encodedSettings = encodeURIComponent(settingsArray);
    
    formattedUrl += `?config=${encodedSettings}`;
    
    return formattedUrl;
  };

  const handleReturn = async () => {
    console.log('Sending config settings to backend:', configSettings);

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configSettings)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed to update attributes: ${response.status}`, errorData.error || '');
      } else {
        const successData = await response.json();
        console.log('Attributes updated successfully:', successData.attributes);
      }
    } catch (error) {
      console.error('Error posting attributes:', error);
    }

    const finalReturnUrl = getFormattedReturnUrl();
    console.log('Returning to URL with settings:', finalReturnUrl);

    try {
      if (window.opener) {
        window.opener.location.href = finalReturnUrl;
        window.close();
        return;
      }
      
      const newWindow = window.open(finalReturnUrl, '_blank');
      if (newWindow) {
        window.close();
        return;
      }
      
      window.location.href = finalReturnUrl;
    } catch (error) {
      console.error('Error during window management:', error);
      window.location.href = finalReturnUrl;
    }
  };

  const isEnabled = (key: string): boolean => {
    return !!configSettings[key];
  };

  const toggleSetting = (key: string) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-white text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 filter blur-2xl opacity-20 -z-10"></div>
      <div className="absolute inset-0 bg-[#0D0D0D] opacity-90 -z-20"></div>

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-8 py-4">
          <div className="text-2xl font-bold">&lt;eqlec-tech /&gt;</div>
          <nav className="space-x-4">
            <Link href="/landing" className="text-sm text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-gray-300 hover:text-white transition">
              Docs
            </Link>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-start flex-1 px-4 py-8">
          <div className="w-full max-w-3xl mx-auto bg-black bg-opacity-50 rounded-2xl border border-gray-800 p-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">
              Accessibility Configuration
            </h1>
            <p className="text-gray-300 mb-8">
              Customize your accessibility settings to enhance user experience.
            </p>

            <div className="space-y-8">
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
                  <ToggleItem 
                    label="Sparser Text" 
                    description="Increase the space between text for better readability"
                    checked={isEnabled('enable-sparse-text')}
                    id="enable-sparse-text"
                    onToggle={() => toggleSetting('enable-sparse-text')}
                  />
                </div>
              </section>

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
                  <ToggleItem 
                    label="Audio Subtitles" 
                    description="Generates subtitles for any audio transmitted through the site"
                    checked={isEnabled('enable-live-subtitles')}
                    id="enable-live-subtitles"
                    onToggle={() => toggleSetting('enable-live-subtitles')}
                  />
                </div>
              </section>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleReturn}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Return
              </button>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-800 py-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} eqlec.tech. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

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

export default function ConfigPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigContent />
    </Suspense>
  );
}