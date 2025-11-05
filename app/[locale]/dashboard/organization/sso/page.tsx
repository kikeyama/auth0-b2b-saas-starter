import { appClient, managementClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { ConnectionsList } from "./connections-list"

import { getTranslations } from 'next-intl/server';

export default async function SSO() {
  // Get translation from messages
  const t = await getTranslations('SSO');

  const session = await appClient.getSession()
  const { data: connections } =
    await managementClient.organizations.getEnabledConnections({
      id: session!.user.org_id!,
    })

  return (
    <div className="space-y-2">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <ConnectionsList
        connections={connections
          // filter out the default connection ID assigned to all organizations
          .filter((c) => c.connection_id !== process.env.DEFAULT_CONNECTION_ID)
          .map((c) => ({
            id: c.connection_id,
            name: c.connection.name,
            strategy: c.connection.strategy,
            assignMembershipOnLogin: c.assign_membership_on_login,
          }))}
      />
    </div>
  )
}
