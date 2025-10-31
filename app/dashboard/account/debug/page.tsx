import React from "react"

import { AppRouterPageRoute } from "@auth0/nextjs-auth0/server"
import { appClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { DisplayUserSession } from "./display-user-session"

export default appClient.withPageAuthRequired(
  async function Debug() {
    const session = await appClient.getSession()

    return (
      <div className="space-y-2">
        <PageHeader
          title="Debug"
          description="See your debug data."
        />

        <DisplayUserSession user={session?.user!} />

      </div>
    )
    // TODO: Let's verify why this is needed, it is possible this roots to Auth0 Next.js SDK
  } as AppRouterPageRoute,
  { returnTo: "/dashboard/account/debug" }
) as React.FC
