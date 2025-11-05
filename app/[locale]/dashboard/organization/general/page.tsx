import { appClient, managementClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { DisplayNameForm } from "./display-name-form"

import { getTranslations } from 'next-intl/server';

export default async function GeneralSettings() {
  // Get translation from messages
  const t = await getTranslations('GeneralSettings');

  const session = await appClient.getSession()
  const { data: org } = await managementClient.organizations.get({
    id: session!.user.org_id!,
  })

  return (
    <div className="space-y-2">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <DisplayNameForm
        organization={{
          id: org.id,
          slug: org.name,
          displayName: org.display_name,
        }}
      />
    </div>
  )
}
