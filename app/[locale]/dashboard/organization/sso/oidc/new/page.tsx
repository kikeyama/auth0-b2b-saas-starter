import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { appClient } from "@/lib/auth0"
import { getOrCreateDomainVerificationToken } from "@/lib/domain-verification"
import { Button } from "@/components/ui/button"
import { AppBreadcrumb } from "@/components/app-breadcrumb"

import { CreateOidcConnectionForm } from "./create-oidc-connection-form"

import { getTranslations } from 'next-intl/server';

export default async function CreateOidcConnection() {
  // Get translation from messages
  const t = await getTranslations('CreateOidcConnection');

  const session = await appClient.getSession()

  const domainVerificationToken = await getOrCreateDomainVerificationToken(
    session!.user.org_id!
  )

  return (
    <div className="space-y-1">
      <div className="px-2 py-3">
        <AppBreadcrumb
          title={t('back')}
          href="/dashboard/organization/sso"
        />
      </div>

      <CreateOidcConnectionForm
        domainVerificationToken={domainVerificationToken}
      />
    </div>
  )
}
