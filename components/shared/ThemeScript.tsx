'use client';

import Script from 'next/script';

export default function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const STORAGE_KEY = 'handbook-theme';
            function getPreferredTheme() {
              var stored = localStorage.getItem(STORAGE_KEY);
              if (stored === 'light' || stored === 'dark') return stored;
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            var theme = getPreferredTheme();
            document.documentElement.classList.toggle('dark', theme === 'dark');
          })();
        `,
      }}
    />
  );
}
