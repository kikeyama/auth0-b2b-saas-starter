import Link from "next/link"

import { Auth0Logo } from "@/components/auth0-logo"

import { CreateOrganizationForm } from "./create-organization-form"

import { getTranslations } from 'next-intl/server';

export default async function Create() {
  // Get translation from messages
  const t = await getTranslations('Create');

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Auth0Logo className="mr-2 size-8" />
          <span className="font-mono font-medium">{t('left.logo')}</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <div className="space-y-1">
              <p className="text-lg">
                {t('left.description_1')}
              </p>
              <p className="text-lg">
                {t('left.description_2')}
              </p>
            </div>
            <footer className="text-sm text-muted-foreground">
              {t('left.credit')}
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('right.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('right.description')}
            </p>
          </div>
          <CreateOrganizationForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t.rich('right.agreement', {
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {chunks}
                </Link>
              )
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
