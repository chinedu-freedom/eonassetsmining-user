import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Polychainapp",
  description: "The Ultimate Crypto Asset Mining Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Polychainapp",
  },
};

import { Providers } from "./providers";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
      <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased translate-no-popup`}
    >
      <head>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
        <Script id="google-translate-init" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <style>{`
          /* Hide Google Translate Tooltips and Popups */
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
