import { redirect } from "next/navigation"
import { redirect as i18nRedirect } from "@/i18n/navigation"
import { getLocale } from 'next-intl/server';

import { appClient, managementClient } from "@/lib/auth0"
import { getOrCreateDomainVerificationToken } from "@/lib/domain-verification"

import { UpdateSamlConnectionForm } from "./update-saml-connection-form"

export default async function UpdateSamlConnection({
  params,
}: {
  params: Promise<{ connectionId: string }>
}) {
  const session = await appClient.getSession()
  const locale = await getLocale()

  if (!session) {
    return redirect("/auth/login")
  }

  const { connectionId } = await params
  // ensure that the connection ID being fetched is owned by the organization
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
      <UpdateSamlConnectionForm
        connection={{
          id: connection.id,
          name: connection.name,
          displayName: connection.display_name,
          assignMembershipOnLogin: enabledConnection.assign_membership_on_login,
          options: {
            signInUrl: connection.options.signInEndpoint,
            signOutUrl: connection.options.signOutEndpoint,
            userIdAttribute: connection.options.user_id_attribute,
            protocolBinding: connection.options.protocolBinding,
            domainAliases: connection.options.domain_aliases,
            signRequest: connection.options.signSAMLRequest,
          },
        }}
        domainVerificationToken={domainVerificationToken}
      />
    </div>
  )
}
