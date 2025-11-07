import { Link } from "@/i18n/navigation"
import { redirect } from "next/navigation"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { appClient } from "@/lib/auth0"
import { getRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarNav } from "@/components/sidebar-nav"

import { getTranslations } from 'next-intl/server';

const getSidebarNavItems = (t: any) => {
  return (
    [
      {
        title: t('sidebar_nav.general'),
        href: "/dashboard/organization/general",
      },
      {
        title: t('sidebar_nav.member'),
        href: "/dashboard/organization/members",
      },
      {
        title: t('sidebar_nav.sso'),
        href: "/dashboard/organization/sso",
      },
      {
        title: t('sidebar_nav.security'),
        href: "/dashboard/organization/security-policies",
      },
    ]
  );
}

interface AccountLayoutProps {
  children: React.ReactNode,
}

export default async function OrganizationLayout({ children }: AccountLayoutProps) {
  // Get translation from messages
  const t = await getTranslations('OrganizationLayout');

  const session = await appClient.getSession()

  // if the user is not authenticated, redirect to login
  if (!session?.user) {
    redirect("/auth/login")
  }

  if (getRole(session.user) !== "admin") {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>{t('unauthorized.title')}</CardTitle>
            <CardDescription className="space-y-1.5">
              <p>
                {t.rich('unauthorized.description_1', {
                  role: (chunks) => <span className="font-semibold">{chunks}</span>,
                  user_role: getRole(session.user)
                })}
              </p>
              <p>
                {t.rich('unauthorized.description_2', {
                  admin: (chunks) => <span className="font-semibold">{chunks}</span>
                })}
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> {t('button')}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex min-h-full flex-col space-y-8 lg:flex-row lg:space-x-4 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={getSidebarNavItems(t)} />
        </aside>
        <div className="rounded-2xl border border-border bg-field p-2 shadow-sm lg:w-4/5">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  )
}
