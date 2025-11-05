import type { Metadata } from "next"

import "../globals.css"

import { Inter } from "next/font/google"
import Script from "next/script"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({params}: Promise<{locale: string}>) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL("https://saastart.app"),
  };
}

export default async function HomeLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{locale: string}>,
}>) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          <Toaster position="bottom-right" />
          <Script id="heap">
            {`window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
          heap.load("1279799279");`}
          </Script>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
