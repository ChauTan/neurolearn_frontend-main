import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import { Providers } from './Provider';
import { Toaster } from '@/components/common/ui/Toaster';
import Script from 'next/script'; // 👈 Thêm dòng này

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Academix',
  description: 'AI-Powered Training & Market',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        <Toaster />

        {/* Chatbase Embed */}
        <Script id="chatbase-embed" strategy="afterInteractive">
          {`(function(){
            if(!window.chatbase || window.chatbase("getState")!=="initialized"){
              window.chatbase = (...arguments) => {
                if(!window.chatbase.q){ window.chatbase.q = [] }
                window.chatbase.q.push(arguments)
              };
              window.chatbase = new Proxy(window.chatbase, {
                get(target, prop){
                  if(prop === "q"){ return target.q }
                  return (...args) => target(prop, ...args)
                }
              })
            }
            const onLoad = function(){
              const script = document.createElement("script");
              script.src = "https://www.chatbase.co/embed.min.js";
              script.id = "wm023caOJhskRuUAm6cK-"; 
              script.domain = "www.chatbase.co";
              document.body.appendChild(script)
            };
            if(document.readyState === "complete"){ onLoad() }
            else { window.addEventListener("load", onLoad) }
          })();`}
        </Script>
      </body>
    </html>
  );
}
