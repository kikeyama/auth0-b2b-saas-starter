import { redirect } from "next/navigation"
import { redirect as i18nRedirect } from "@/i18n/navigation"
import { getLocale } from 'next-intl/server';

import { appClient, managementClient } from "@/lib/auth0"
import { getOrCreateDomainVerificationToken } from "@/lib/domain-verification"

import { UpdateOidcConnectionForm } from "./update-oidc-connection-form"

export default async function UpdateOidcConnection({
  params,
}: {
  params: Promise<{ connectionId: string }>
}) {
  const session = await appClient.getSession()
  const locale = await getLocale()

  if (!session) {
    return redirect("/auth/login")
  }

  // ensure that the connection ID being fetched is owned by the organization
  const { connectionId } = await params
  const { data: enabledConnection } =
    await managementClient.organizations.getEnabledConnection({
      id: session.user.org_id!,
      connectionId,
    })

  if (!enabledConnection) {
    i18nRedirect({ href: "/dashboard/organization/sso", locale })
  }

  const [domainVerificationToken, { data: connection }] = await Promise.all([
    getOrCreateDomainVerificationToken(session!.user.org_id!),
    managementClient.connections.get({ id: connectionId }),
  ])

  return (
    <div>
      <UpdateOidcConnectionForm
        connection={{
          id: connection.id,
          name: connection.name,
          displayName: connection.display_name,
          assignMembershipOnLogin: enabledConnection.assign_membership_on_login,
          options: {
            discoveryUrl: connection.options.discovery_url,
            domainAliases: connection.options.domain_aliases,
            clientId: connection.options.client_id,
            clientSecret: connection.options.client_secret,
            scope: connection.options.scope,
            type: connection.options.type,
          },
        }}
        domainVerificationToken={domainVerificationToken}
      />
    </div>
  )
}
