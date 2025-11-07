import Link from "next/link"

import { appClient } from "@/lib/auth0"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Auth0Logo } from "@/components/auth0-logo"

import { SignUpForm } from "./signup-form"
import { WelcomeBackCard } from "./welcome-back-card"
import { SubmitButton } from "@/components/submit-button"

//import {use} from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function Home({
  params
}: Readonly<{
  params: Promise<{locale: string}>
}>) {
//  const {locale} = use(params);
  const {locale} = await params;
  // Enable static rendering
  setRequestLocale(locale);
  // Get translation from messages
  const t = await getTranslations('IndexPage');

  const session = await appClient.getSession();

  return (
    <div className="container relative sm:grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {session ? (
        <Link
          href="/auth/logout"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <SubmitButton>{t('logout')}</SubmitButton>
        </Link>
      ) : (
        <div
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          <span className="text-sm">{t('joined')}</span>
          <Link
            className="text-sm underline"
            href="/auth/login?returnTo=/dashboard"
          >
            <SubmitButton>{t('login')}</SubmitButton>
          </Link>
        </div>
      )}

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Auth0Logo className="mr-2 size-8" />
          <span className="font-semibold">{t('app_name')}</span>
        </div>
        <div className="relative z-20 m-auto max-w-sm text-center">
          <blockquote className="space-y-2">
            <div className="space-y-8">
              <p className="text-lg font-medium">
                {t('description_1')}
              </p>
              <p className="text-lg">
                {t('description_2')}
              </p>
            </div>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex h-screen">
        {session ? <WelcomeBackCard /> : <SignUpForm />}
      </div>
    </div>
  )
}
