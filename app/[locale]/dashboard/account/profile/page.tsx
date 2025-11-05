import React from "react"

import { AppRouterPageRoute } from "@auth0/nextjs-auth0/server"
import { appClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { DeleteAccountForm } from "./delete-account-form"
import { DisplayNameForm } from "./display-name-form"

import { getTranslations } from 'next-intl/server';

export default appClient.withPageAuthRequired(
  async function Profile() {
    // Get translation from messages
    const t = await getTranslations('Profile');

    const session = await appClient.getSession()

    return (
      <div className="space-y-2">
        <PageHeader
          title={t('title')}
          description={t('description')}
        />

        <DisplayNameForm displayName={session?.user.name!} />

        <DeleteAccountForm />
      </div>
    )
    // TODO: Let's verify why this is needed, it is possible this roots to Auth0 Next.js SDK
  } as AppRouterPageRoute,
  { returnTo: "/dashboard/account/profile" }
) as React.FC
